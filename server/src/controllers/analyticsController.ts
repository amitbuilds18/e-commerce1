import { Request, Response } from "express";
import pool from "../config/db.js";

export const getAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='user'"
    );

    const admins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='admin'"
    );

    const products = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    const orders = await pool.query(
      "SELECT COUNT(*) FROM orders"
    );

    const revenue = await pool.query(
      `
      SELECT
      COALESCE(SUM(total),0) AS revenue
      FROM orders
      `
    );

    res.json({
      success: true,

      analytics: {
        totalUsers: users.rows[0].count,
        totalAdmins: admins.rows[0].count,
        totalProducts: products.rows[0].count,
        totalOrders: orders.rows[0].count,
        totalRevenue: revenue.rows[0].revenue,
      },
    });

  } catch (err) {

    res.status(500).json({
      success:false,
      message:"Server Error",
    });

  }
};