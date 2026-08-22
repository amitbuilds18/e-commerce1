function isPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function validateCreateCheckoutBody(body: any): string | null {
  if (!body || typeof body !== "object") {
    return "Request body is required.";
  }

  if (!Array.isArray(body.cart) || body.cart.length === 0) {
    return "cart is required and must contain at least one item.";
  }

  for (const item of body.cart) {
    if (!item || !Number.isInteger(Number(item.id)) || Number(item.id) <= 0) {
      return "Each cart item must include a valid product id.";
    }
    if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
      return "Each cart item must include a valid quantity.";
    }
  }

  return null;
}

export function validateConfirmPaymentBody(body: any): string | null {
  if (!body || typeof body !== "object") {
    return "Request body is required.";
  }

  if (!body.session_id || typeof body.session_id !== "string") {
    return "session_id is required.";
  }

  if (!Array.isArray(body.cart) || body.cart.length === 0) {
    return "cart is required and must contain at least one item.";
  }

  for (const item of body.cart) {
    if (!item || typeof item !== "object") {
      return "Each cart item must be an object.";
    }

    const productId = Number(item.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return "Each cart item must include a valid product id.";
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return "Each cart item must include a valid quantity.";
    }

  }

  return null;
}
