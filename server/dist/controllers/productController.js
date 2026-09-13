import pool from "../config/db.js";
// =========================
// Get All Products
// =========================
export const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, rating, sort, page = "1", limit = "12", } = req.query;
        const conditions = [];
        const values = [];
        let idx = 1;
        if (search && typeof search === "string" && search.trim() !== "") {
            conditions.push(`(name ILIKE $${idx} OR description ILIKE $${idx})`);
            values.push(`%${search.trim()}%`);
            idx++;
        }
        if (category && typeof category === "string" && category.trim() !== "" && category.toLowerCase() !== "all") {
            conditions.push(`category ILIKE $${idx}`);
            values.push(category.trim());
            idx++;
        }
        if (minPrice != null && minPrice !== "" && !isNaN(Number(minPrice))) {
            conditions.push(`price >= $${idx}`);
            values.push(Number(minPrice));
            idx++;
        }
        if (maxPrice != null && maxPrice !== "" && !isNaN(Number(maxPrice))) {
            conditions.push(`price <= $${idx}`);
            values.push(Number(maxPrice));
            idx++;
        }
        if (rating != null && rating !== "" && !isNaN(Number(rating))) {
            conditions.push(`rating >= $${idx}`);
            values.push(Number(rating));
            idx++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        let orderBy = "ORDER BY id ASC";
        if (sort === "price_asc") {
            orderBy = "ORDER BY price ASC";
        }
        else if (sort === "price_desc") {
            orderBy = "ORDER BY price DESC";
        }
        else if (sort === "rating_desc") {
            orderBy = "ORDER BY rating DESC";
        }
        else if (sort === "newest") {
            orderBy = "ORDER BY id DESC";
        }
        const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
        const countResult = await pool.query(countQuery, values);
        const total = Number(countResult.rows[0].count);
        const pageNum = Math.max(1, parseInt(String(page)) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(String(limit)) || 12));
        const offset = (pageNum - 1) * limitNum;
        const dataQuery = `SELECT * FROM products ${whereClause} ${orderBy} LIMIT $${idx} OFFSET $${idx + 1}`;
        const dataValues = [...values, limitNum, offset];
        const result = await pool.query(dataQuery, dataValues);
        res.status(200).json({
            success: true,
            products: result.rows,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
    catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Server Error",
        });
    }
};
// =========================
// Get Product By ID
// =========================
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }
        res.status(200).json({
            success: true,
            product: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// =========================
// Create Product
// =========================
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, image, rating, } = req.body;
        const result = await pool.query(`
      INSERT INTO products
      (
        name,
        description,
        category,
        price,
        image,
        rating
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6
      )
      RETURNING *
      `, [
            name,
            description,
            category,
            price,
            image,
            rating,
        ]);
        res.status(201).json({
            success: true,
            product: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// =========================
// Update Product
// =========================
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, image, rating, } = req.body;
        const result = await pool.query(`
      UPDATE products
      SET
      name=$1,
      description=$2,
      category=$3,
      price=$4,
      image=$5,
      rating=$6
      WHERE id=$7
      RETURNING *
      `, [
            name,
            description,
            category,
            price,
            image,
            rating,
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }
        res.status(200).json({
            success: true,
            product: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// =========================
// Delete Product
// =========================
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
