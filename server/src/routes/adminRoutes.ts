import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import { getDashboardStats } from "../controllers/adminController.js";

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("admin", "superAdmin"),
  getDashboardStats
);

// ================= ORDERS =================

// Get All Orders
router.get(
  "/orders",
  protect,
  authorize("admin", "superAdmin"),
  getOrders
);

// Update Order
router.put(
  "/orders/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateOrderStatus
);

// Delete Order
router.delete(
  "/orders/:id",
  protect,
  authorize("admin", "superAdmin"),
  deleteOrder
);

export default router;