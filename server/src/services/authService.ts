import bcrypt from "bcrypt";
import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (payload: RegisterPayload) => {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [payload.email]
  );

  if (existingUser.rows.length > 0) {
    const error = new Error("User already exists");
    (error as any).statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING id,name,email,role`,
    [payload.name, payload.email, hashedPassword]
  );

  const user = result.rows[0];
  return {
    user,
    token: generateToken(user.id, user.role),
  };
};

export const login = async (payload: LoginPayload) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [payload.email]
  );

  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");
    (error as any).statusCode = 400;
    throw error;
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    (error as any).statusCode = 400;
    throw error;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user.id, user.role),
  };
};