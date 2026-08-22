import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
} from "../controllers/wishlistController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/:id", protect, removeWishlistItem);

export default router;