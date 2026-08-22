function isPositiveInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}
export function validateAddCartBody(body) {
    if (!body || typeof body !== "object") {
        return "Request body is required.";
    }
    if (body.product_id == null) {
        return "product_id is required.";
    }
    const productId = Number(body.product_id);
    if (!isPositiveInteger(productId)) {
        return "product_id must be a positive integer.";
    }
    const quantity = Number(body.quantity);
    if (!isPositiveInteger(quantity)) {
        return "quantity must be a positive integer.";
    }
    return null;
}
export function validateCartItemIdParam(params) {
    if (!params || params.id == null) {
        return "Cart item id is required.";
    }
    const id = Number(params.id);
    if (!isPositiveInteger(id)) {
        return "Cart item id must be a positive integer.";
    }
    return null;
}
