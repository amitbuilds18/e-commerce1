import pool from "../config/db.js";
export const getUserProfile = async (userId) => {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id=$1", [userId]);
    if (result.rows.length === 0) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    return result.rows[0];
};
export const updateUserProfile = async (userId, data) => {
    const existing = await pool.query("SELECT id FROM users WHERE id=$1", [userId]);
    if (existing.rows.length === 0) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    const result = await pool.query(`UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email)
     WHERE id = $3
     RETURNING id, name, email, role`, [data.name ?? null, data.email ?? null, userId]);
    return result.rows[0];
};
