import { Request, Response } from "express";
import pool from "../config/db.js";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    // Total Users
    const users = await pool.query(`
      SELECT COUNT(*) FROM users
    `);

    // Total Products
    const products = await pool.query(`
      SELECT COUNT(*) FROM products
    `);

    // Total Orders
    const orders = await pool.query(`
      SELECT COUNT(*) FROM orders
    `);

    // Revenue
    const revenue = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE payment_status='Paid'
    `);

    // Recent Orders
    const recentOrders = await pool.query(`
      SELECT
      orders.id,
      users.name,
      products.name AS product,
      orders.quantity,
      orders.total,
      orders.status,
      orders.payment_status,
      orders.created_at

      FROM orders

      JOIN users
      ON users.id=orders.user_id

      JOIN products
      ON products.id=orders.product_id

      ORDER BY orders.created_at DESC

      LIMIT 5
    `);

    res.json({
      success: true,

      stats: {
        totalUsers: Number(users.rows[0].count),

        totalProducts: Number(products.rows[0].count),

        totalOrders: Number(orders.rows[0].count),

        totalRevenue: Number(revenue.rows[0].revenue),
      },

      recentOrders: recentOrders.rows,
    });

  } catch (err: any) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};