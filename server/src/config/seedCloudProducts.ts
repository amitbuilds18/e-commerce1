import pool from "./db.js";

const sampleProducts = [
  {
    name: "Classic T-Shirt",
    category: "Men",
    price: 999,
    rating: 4.5,
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    description: "Premium 100% breathable cotton slim-fit casual t-shirt.",
  },
  {
    name: "Blue Jeans",
    category: "Men",
    price: 1499,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600",
    description: "Classic comfort-stretch denim jeans with tailored modern fit.",
  },
  {
    name: "Winter Hoodie",
    category: "Women",
    price: 1999,
    rating: 4.8,
    stock: 50,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
    description: "Ultra-warm fleece pullover hoodie with front kangaroo pocket.",
  },
  {
    name: "Formal Shirt",
    category: "Men",
    price: 1299,
    rating: 4.4,
    stock: 50,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    description: "Crisp button-down formal executive dress shirt.",
  },
  {
    name: "Leather Jacket",
    category: "Men",
    price: 2499,
    rating: 4.8,
    stock: 50,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    description: "Genuine leather biker jacket with metallic zippers and sleek lining.",
  },
  {
    name: "Running Shoes",
    category: "Shoes",
    price: 2999,
    rating: 4.9,
    stock: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    description: "Lightweight responsive cushioned running sneakers for all-day comfort.",
  },
  {
    name: "Luxury Watch",
    category: "Accessories",
    price: 3999,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600",
    description: "Precision chronograph analog watch with genuine leather strap.",
  },
  {
    name: "Travel Bag",
    category: "Accessories",
    price: 1899,
    rating: 4.6,
    stock: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    description: "Spacious water-resistant travel duffle and weekender backpack.",
  },
  {
    name: "Sports Cap",
    category: "Accessories",
    price: 599,
    rating: 4.5,
    stock: 50,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    description: "Adjustable athletic cotton baseball cap with UV protection.",
  },
  {
    name: "Summer Dress",
    category: "Women",
    price: 1799,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
    description: "Flowy floral summer dress with lightweight breathable fabric.",
  },
  {
    name: "Sunglasses",
    category: "Accessories",
    price: 999,
    rating: 4.6,
    stock: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    description: "Polarized UV400 classic aviator sunglasses with metal frame.",
  },
  {
    name: "Premium Hoodie",
    category: "Men",
    price: 2199,
    rating: 4.8,
    stock: 50,
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600",
    description: "Heavyweight oversized streetwear fleece hoodie.",
  },
];

async function seedCloudProducts() {
  try {
    await pool.query("DELETE FROM cart");
    await pool.query("DELETE FROM wishlist");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM products");

    for (const p of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, category, price, rating, stock, image, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.category, p.price, p.rating, p.stock, p.image, p.description]
      );
    }

    console.log("\n==========================================================================");
    console.log("🎉 SUCCESS: 12 Distinct StyleHub Products Seeded into Database!");
    console.log("==========================================================================");
    const res = await pool.query("SELECT id, name, category, price, image FROM products ORDER BY id ASC");
    console.table(res.rows);
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
}

seedCloudProducts();
