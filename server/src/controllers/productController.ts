import { Request, Response } from "express";
import pool from "../config/db.js";

// =========================
// Get All Products
// =========================
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      products: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Get Product By ID
// =========================
export const getProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

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

  } catch (error) {
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
export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      name,
      description,
      category,
      price,
      image,
      rating,
    } = req.body;

    const result = await pool.query(
      `
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
      `,
      [
        name,
        description,
        category,
        price,
        image,
        rating,
      ]
    );

    res.status(201).json({
      success: true,
      product: result.rows[0],
    });

  } catch (error) {

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
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.params;

    const {
      name,
      description,
      category,
      price,
      image,
      rating,
    } = req.body;

    const result = await pool.query(
      `
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
      `,
      [
        name,
        description,
        category,
        price,
        image,
        rating,
        id,
      ]
    );

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

  } catch (error) {

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
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING *",
      [id]
    );

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

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};