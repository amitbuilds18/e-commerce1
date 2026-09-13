-- =======================================================
-- StyleHub PostgreSQL Database Schema & Initial Seed Data
-- =======================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user', 'admin', 'superAdmin'
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    stock INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CART TABLE
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PAYMENT CONFIRMATIONS TABLE (Idempotency for Stripe)
CREATE TABLE IF NOT EXISTS payment_confirmations (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =======================================================
-- PERFORMANCE INDEXES
-- =======================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- =======================================================
-- SAMPLE INITIAL PRODUCTS SEED
-- =======================================================
INSERT INTO products (name, description, category, price, image, rating)
VALUES
  ('Classic Denim Jacket', 'Premium durable denim jacket with sleek fit.', 'Men', 2499.00, '/products/jacket.jpg', 4.8),
  ('Floral Summer Dress', 'Breathable lightweight floral print cotton dress.', 'Women', 1899.00, '/products/dress.jpg', 4.7),
  ('Smart Chronograph Watch', 'Water-resistant luxury chronograph timepiece with leather strap.', 'Accessories', 4999.00, '/products/watch.jpg', 4.9),
  ('Comfort Fit Hoodie', 'Ultra-soft fleece warm pullover hoodie.', 'Men', 1499.00, '/products/hoodie.jpg', 4.6),
  ('Leather Crossbody Bag', 'Genuine leather stylish shoulder messenger bag.', 'Accessories', 2999.00, '/products/bag.jpg', 4.8),
  ('Classic White Sneakers', 'Minimalist street-style cushioned sneakers.', 'Shoes', 3499.00, '/products/shoes.jpg', 4.7)
ON CONFLICT DO NOTHING;
