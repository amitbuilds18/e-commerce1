import { Request, Response } from "express";
import pool from "../config/db.js";

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      notifications: result.rows,
    });

  } catch {

    res.status(500).json({
      success:false,
      message:"Server Error",
    });

  }
};

export const markAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    await pool.query(
      `
      UPDATE notifications
      SET is_read=true
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Notification Read",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

export const createNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO notifications (message, is_read)
      VALUES ($1, false)
      RETURNING *
      `,
      [message.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Notification created",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Create Notification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  try {
    await pool.query("DELETE FROM notifications WHERE id=$1", [req.params.id]);

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};