import pool from "../config/db.js";
// Add to Wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { product_id } = req.body;
        // Check if product already exists in wishlist
        const exists = await pool.query("SELECT * FROM wishlist WHERE user_id=$1 AND product_id=$2", [userId, product_id]);
        if (exists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }
        const result = await pool.query(`INSERT INTO wishlist(user_id, product_id)
       VALUES($1,$2)
       RETURNING *`, [userId, product_id]);
        res.status(201).json({
            success: true,
            wishlist: result.rows[0],
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
// Get Wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await pool.query(`
      SELECT
        wishlist.id,
        products.id AS product_id,
        products.name,
        products.price,
        products.image
      FROM wishlist
      JOIN products
      ON wishlist.product_id = products.id
      WHERE wishlist.user_id = $1
      `, [userId]);
        res.json({
            success: true,
            wishlist: result.rows,
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
// Remove from Wishlist
export const removeWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM wishlist WHERE id=$1", [id]);
        res.json({
            success: true,
            message: "Removed from wishlist",
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
