import * as orderService from "../services/orderService.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";
import { validatePlaceOrderBody, validateOrderIdParam, validateOrderStatusBody, } from "../validators/orderValidator.js";
// =====================================
// PLACE ORDER
// =====================================
export const placeOrder = async (req, res) => {
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
        const phone = String(req.body.phone || "").trim();
        if (phone) {
            await sendWhatsAppMessage({
                to: phone,
                message: `Your order has been placed successfully. Order ID: ${order.id}. Thank you for shopping with StyleHub!`,
            });
        }
        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order,
        });
    }
    catch (error) {
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
export const getMyOrders = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders. Please try again later.",
        });
    }
};
// =====================================
// USER SINGLE ORDER DETAILS
// =====================================
export const getOrderById = async (req, res) => {
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
    }
    catch (error) {
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
export const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders();
        return res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders. Please try again later.",
        });
    }
};
// =====================================
// UPDATE ORDER STATUS
// =====================================
export const updateOrderStatus = async (req, res) => {
    const validationError = validateOrderIdParam(req.params) || validateOrderStatusBody(req.body);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }
    try {
        const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
        if (order && order.user_id) {
            const userResult = await orderService.getUserByOrderId(order.user_id);
            const customerPhone = userResult?.phone;
            if (customerPhone) {
                await sendWhatsAppMessage({
                    to: customerPhone,
                    message: `Your order status has been updated to: ${req.body.status}. Order ID: ${order.id}.`,
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: "Order updated successfully.",
            order,
        });
    }
    catch (error) {
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
export const deleteOrder = async (req, res) => {
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
    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Unable to delete order. Please try again later.",
        });
    }
};
