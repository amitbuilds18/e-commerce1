import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Routes
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  deleteProduct
);

export default router;