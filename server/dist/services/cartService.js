import pool from "../config/db.js";
export const addToCart = async (userId, payload) => {
    const result = await pool.query(`INSERT INTO cart(user_id,product_id,quantity)
      VALUES($1,$2,$3)
      RETURNING *`, [userId, payload.product_id, payload.quantity]);
    return result.rows[0];
};
export const getCart = async (userId) => {
    const result = await pool.query(`SELECT cart.id, cart.quantity, products.id AS product_id, products.name, products.price, products.image
      FROM cart
      JOIN products ON cart.product_id=products.id
      WHERE cart.user_id=$1`, [userId]);
    return result.rows;
};
export const removeCartItem = async (userId, cartItemId) => {
    const result = await pool.query("DELETE FROM cart WHERE id=$1 AND user_id=$2 RETURNING *", [cartItemId, userId]);
    if (result.rows.length === 0) {
        const error = new Error("Cart item not found or unauthorized.");
        error.statusCode = 404;
        throw error;
    }
    return true;
};
