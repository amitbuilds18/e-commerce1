export const ALLOWED_ORDER_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];
export function validatePlaceOrderBody(body) {
    if (!body || typeof body !== "object") {
        return "Request body is required.";
    }
    if (body.product_id == null) {
        return "product_id is required.";
    }
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return "quantity must be a positive integer.";
    }
    const total = Number(body.total);
    if (!Number.isFinite(total) || total < 0) {
        return "total must be a valid non-negative number.";
    }
    return null;
}
export function validateOrderStatusBody(body) {
    if (!body || typeof body !== "object") {
        return "Request body is required.";
    }
    if (!body.status || typeof body.status !== "string") {
        return "status is required.";
    }
    if (!ALLOWED_ORDER_STATUSES.includes(body.status)) {
        return `status must be one of: ${ALLOWED_ORDER_STATUSES.join(", ")}`;
    }
    return null;
}
export function validateOrderIdParam(params) {
    if (!params || params.id == null) {
        return "Order id is required.";
    }
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return "Order id must be a positive integer.";
    }
    return null;
}
