import pool from "../config/db.js";
export const getNotifications = async (req, res) => {
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
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
export const markAsRead = async (req, res) => {
    try {
        await pool.query(`
      UPDATE notifications
      SET is_read=true
      WHERE id=$1
      `, [req.params.id]);
        res.json({
            success: true,
            message: "Notification Read"
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
