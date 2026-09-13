import bcrypt from "bcrypt";
import pool from "./db.js";

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting Database Seeding...");

    // 1. Create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Hash default password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 3. Upsert SuperAdmin, Admin, and User
    const defaultAccounts = [
      {
        name: "Master SuperAdmin",
        email: "superadmin@stylehub.com",
        password: hashedPassword,
        role: "superAdmin",
      },
      {
        name: "Staff Admin",
        email: "admin@stylehub.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Demo Customer",
        email: "user@stylehub.com",
        password: hashedPassword,
        role: "user",
      },
    ];

    for (const acc of defaultAccounts) {
      await pool.query(
        `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET role = EXCLUDED.role, password = EXCLUDED.password
        `,
        [acc.name, acc.email, acc.password, acc.role]
      );
      console.log(`✅ Ready: ${acc.role.toUpperCase()} -> Email: ${acc.email} | Password: password123`);
    }

    console.log("🎉 Seeding Completed Successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
};

seedDatabase();
