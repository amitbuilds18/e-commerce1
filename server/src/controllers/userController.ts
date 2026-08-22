import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  res.json({
    success: true,
    message: "Protected Route",
    user: req.user,
  });
};