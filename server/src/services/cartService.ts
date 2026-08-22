import pool from "../config/db.js";

export interface AddCartPayload {
  product_id: number;
  quantity: number;
}

export const addToCart = async (userId: number, payload: AddCartPayload) => {
  const result = await pool.query(
    `INSERT INTO cart(user_id,product_id,quantity)
      VALUES($1,$2,$3)
      RETURNING *`,
    [userId, payload.product_id, payload.quantity]
  );

  return result.rows[0];
};

export const getCart = async (userId: number) => {
  const result = await pool.query(
    `SELECT cart.id, cart.quantity, products.id AS product_id, products.name, products.price, products.image
      FROM cart
      JOIN products ON cart.product_id=products.id
      WHERE cart.user_id=$1`,
    [userId]
  );

  return result.rows;
};

export const removeCartItem = async (userId: number, cartItemId: number) => {
  const result = await pool.query(
    "DELETE FROM cart WHERE id=$1 AND user_id=$2 RETURNING *",
    [cartItemId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Cart item not found or unauthorized.");
    (error as any).statusCode = 404;
    throw error;
  }

  return true;
};