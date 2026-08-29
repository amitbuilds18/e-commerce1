import { Response } from "express";
import pool from "../config/db.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile fetched successfully",
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, is_blocked FROM users ORDER BY id ASC"
    );

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error: any) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};