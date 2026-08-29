import express from "express";

import {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { validateBody, validateParams } from "../middleware/validateMiddleware.js";
import {
  validatePlaceOrderBody,
  validateOrderIdParam,
  validateOrderStatusBody,
} from "../validators/orderValidator.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ===================================
// USER PLACE ORDER
// ===================================

router.post(
  "/",
  protect,
  authorize("user"),
  validateBody(validatePlaceOrderBody),
  placeOrder
);

// ===================================
// USER MY ORDERS
// ===================================

router.get(
  "/my-orders",
  protect,
  authorize("user"),
  getMyOrders
);

// ===================================
// USER SINGLE ORDER DETAILS
// ===================================

router.get(
  "/:id",
  protect,
  authorize("user", "admin", "superAdmin"),
  validateParams(validateOrderIdParam),
  getOrderById
);

// ===================================
// ADMIN GET ALL ORDERS
// ===================================

router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  getOrders
);

// ===================================
// ADMIN UPDATE ORDER STATUS
// ===================================

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  validateParams(validateOrderIdParam),
  validateBody(validateOrderStatusBody),
  updateOrderStatus
);

// ===================================
// ADMIN DELETE ORDER
// ===================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  validateParams(validateOrderIdParam),
  deleteOrder
);

export default router;