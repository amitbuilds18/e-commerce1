import { Request, Response } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

// ===============================
// GET ALL ADMINS
// ===============================
export const getAdmins = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE role='admin'
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      admins: result.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// CREATE ADMIN
// ===============================
export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const { name, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users
      (name,email,password,role)
      VALUES($1,$2,$3,'admin')
      `,
      [name, email, hashed]
    );

    res.json({
      success: true,
      message: "Admin Created Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===============================
// UPDATE ADMIN
// ===============================
export const updateAdmin = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;
    const { name, email } = req.body;

    await pool.query(
      `
      UPDATE users
      SET
      name=$1,
      email=$2
      WHERE id=$3
      `,
      [name, email, id]
    );

    res.json({
      success: true,
      message: "Admin Updated Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// ===============================
// DELETE ADMIN
// ===============================
export const deleteAdmin = async (
  req: Request,
  res: Response
) => {

  try {

    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Admin Deleted Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// ===============================
// GET ALL USERS
// ===============================
export const getUsers = async (
  req: Request,
  res: Response
) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        role,
        is_blocked
      FROM users
      WHERE role='user'
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      users: result.rows,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// ===============================
// BLOCK / UNBLOCK USER
// ===============================
export const blockUser = async (
  req: Request,
  res: Response
) => {

  try {

    await pool.query(
      `
      UPDATE users
      SET is_blocked = NOT is_blocked
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "User Status Updated",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// ===============================
// DELETE USER
// ===============================
export const deleteUser = async (
  req: Request,
  res: Response
) => {

  try {

    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "User Deleted Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};