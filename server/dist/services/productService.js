import pool from "../config/db.js";
export const createProduct = async (payload) => {
    const result = await pool.query(`INSERT INTO products(name,description,category,price,image,rating)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`, [payload.name, payload.description, payload.category, payload.price, payload.image, payload.rating ?? null]);
    return result.rows[0];
};
export const getProducts = async () => {
    const result = await pool.query("SELECT id,name,description,category,price,image,rating FROM products ORDER BY id ASC");
    return result.rows;
};
export const getProductById = async (id) => {
    const result = await pool.query("SELECT id,name,description,category,price,image,rating FROM products WHERE id=$1", [id]);
    if (result.rows.length === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return result.rows[0];
};
export const updateProduct = async (id, payload) => {
    const result = await pool.query(`UPDATE products SET name=$1, description=$2, category=$3, price=$4, image=$5, rating=$6
    WHERE id=$7 RETURNING *`, [payload.name, payload.description, payload.category, payload.price, payload.image, payload.rating ?? null, id]);
    if (result.rows.length === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return result.rows[0];
};
export const deleteProduct = async (id) => {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return true;
};
