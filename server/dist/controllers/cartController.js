import pool from "../config/db.js";
// Add To Cart
export const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user?.id;
        const result = await pool.query(`INSERT INTO cart(user_id,product_id,quantity)
       VALUES($1,$2,$3)
       RETURNING *`, [user_id, product_id, quantity]);
        res.status(201).json({
            success: true,
            cart: result.rows[0],
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// Get Cart
export const getCart = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const result = await pool.query(`
      SELECT
      cart.id,
      cart.quantity,
      products.name,
      products.price,
      products.image
      FROM cart
      JOIN products
      ON cart.product_id=products.id
      WHERE cart.user_id=$1
      `, [user_id]);
        res.json({
            success: true,
            cart: result.rows,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// Remove Item
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM cart WHERE id=$1", [id]);
        res.json({
            success: true,
            message: "Item Removed",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
