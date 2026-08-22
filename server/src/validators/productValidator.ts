function isPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function validateProductBody(body: any): string | null {
  if (!body || typeof body !== "object") {
    return "Request body is required.";
  }

  const { name, description, category, price, image, rating } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "Product name is required.";
  }

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return "Product description is required.";
  }

  if (!category || typeof category !== "string" || category.trim().length === 0) {
    return "Product category is required.";
  }

  if (!isPositiveNumber(price)) {
    return "Product price must be a positive number.";
  }

  if (!image || typeof image !== "string" || image.trim().length === 0) {
    return "Product image URL is required.";
  }

  if (rating != null && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return "Rating must be a number between 0 and 5.";
  }

  return null;
}

export function validateProductIdParam(params: any): string | null {
  if (!params || params.id == null) {
    return "Product id is required.";
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return "Product id must be a positive integer.";
  }

  return null;
}
