import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import * as orderService from "../services/orderService.js";
import {
  validatePlaceOrderBody,
  validateOrderIdParam,
  validateOrderStatusBody,
} from "../validators/orderValidator.js";

// =====================================
// PLACE ORDER
// =====================================

export const placeOrder = async (
  req: AuthRequest,
  res: Response
) => {
  const validationError = validatePlaceOrderBody(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  try {
    const order = await orderService.placeOrder(userId, {
      product_id: Number(req.body.product_id),
      quantity: Number(req.body.quantity),
      total: Number(req.body.total),
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to place order. Please try again later.",
    });
  }
};

// =====================================
// USER MY ORDERS
// =====================================

export const getMyOrders = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  try {
    const orders = await orderService.getMyOrders(userId);
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders. Please try again later.",
    });
  }
};

// =====================================
// USER SINGLE ORDER DETAILS
// =====================================

export const getOrderById = async (
  req: AuthRequest,
  res: Response
) => {
  const validationError = validateOrderIdParam(req.params);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const userId = req.user?.id;
  const role = req.user?.role;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  try {
    const order = await orderService.getOrderById(Number(req.params.id), userId, role);
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to fetch order details. Please try again later.",
    });
  }
};

// =====================================
// ADMIN GET ALL ORDERS
// =====================================

export const getOrders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const orders = await orderService.getOrders();
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders. Please try again later.",
    });
  }
};

// =====================================
// UPDATE ORDER STATUS
// =====================================

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
) => {
  const validationError = validateOrderIdParam(req.params) || validateOrderStatusBody(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to update order status. Please try again later.",
    });
  }
};

// =====================================
// DELETE ORDER
// =====================================

export const deleteOrder = async (
  req: AuthRequest,
  res: Response
) => {
  const validationError = validateOrderIdParam(req.params);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    await orderService.deleteOrder(Number(req.params.id));
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to delete order. Please try again later.",
    });
  }
};