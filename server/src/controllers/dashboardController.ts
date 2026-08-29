import { Request, Response } from "express";
import pool from "../config/db.js";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    const users = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    const orders = await pool.query(
      "SELECT COUNT(*) FROM orders"
    );

    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total),0) AS revenue FROM orders WHERE payment_status='Paid'"
    );

    res.json({
      success: true,
      products: Number(products.rows[0].count),
      users: Number(users.rows[0].count),
      orders: Number(orders.rows[0].count),
      revenue: Number(revenue.rows[0].revenue),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};