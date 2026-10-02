import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.PGURL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || process.env.DB_HOST || "localhost",
        port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
        database: process.env.PGDATABASE || process.env.DB_NAME || "postgres",
        user: process.env.PGUSER || process.env.DB_USER || "postgres",
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || "",
        ssl:
          process.env.PGHOST && process.env.PGHOST !== "localhost"
            ? { rejectUnauthorized: false }
            : undefined,
      }
);

async function ensureDatabaseSchema() {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
        phone VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

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

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        total NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payment_confirmations (
        session_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Ensure columns exist in case tables were created with earlier schemas
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'user';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 50;
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255);
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending';
    `);
    console.log("✅ Database Schema & Columns Verified");
  } catch (err: any) {
    console.error("⚠️ Database Schema Verification Warning:", err.message);
  }
}

export { ensureDatabaseSchema };

pool.connect()
  .then(async () => {
    console.log("✅ PostgreSQL Connected");
    await ensureDatabaseSchema();
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
    console.error(
      "Check DATABASE_URL or PGHOST/DB_HOST in your Vercel/local environment variables."
    );
  });

export default pool;