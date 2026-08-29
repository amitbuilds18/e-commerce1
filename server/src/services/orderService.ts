import pool from "../config/db.js";

export interface PlaceOrderPayload {
  product_id: number;
  quantity: number;
  total: number;
}

export const placeOrder = async (
  userId: number,
  payload: PlaceOrderPayload
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      "SELECT id, price FROM products WHERE id = $1",
      [payload.product_id]
    );

    if (productResult.rows.length === 0) {
      const error = new Error("Product not found.");
      (error as any).statusCode = 404;
      throw error;
    }

    const productPrice = Number(productResult.rows[0].price);
    const expectedTotal = productPrice * payload.quantity;
    if (payload.total !== expectedTotal) {
      const error = new Error("Total does not match the product price and quantity.");
      (error as any).statusCode = 400;
      throw error;
    }

    const result = await client.query(
      `
      INSERT INTO orders
      (
        user_id,
        product_id,
        quantity,
        total,
        status,
        payment_status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [userId, payload.product_id, payload.quantity, payload.total, "Pending", "Pending"]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getMyOrders = async (userId: number) => {
  const result = await pool.query(
    `
      SELECT
        orders.id,
        products.name AS product_name,
        products.image,
        products.price,
        orders.quantity,
        orders.total,
        orders.status,
        orders.payment_status,
        orders.created_at
      FROM orders
      INNER JOIN products ON products.id = orders.product_id
      WHERE orders.user_id = $1
      ORDER BY orders.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const getOrderById = async (orderId: number, userId: number, role?: string) => {
  const isAdmin = role === "admin" || role === "superAdmin";
  const query = isAdmin
    ? `
      SELECT
        orders.id,
        products.id AS product_id,
        products.name,
        products.description,
        products.image,
        products.price,
        orders.quantity,
        orders.total,
        orders.status,
        orders.payment_status,
        orders.created_at
      FROM orders
      INNER JOIN products ON products.id = orders.product_id
      WHERE orders.id = $1
    `
    : `
      SELECT
        orders.id,
        products.id AS product_id,
        products.name,
        products.description,
        products.image,
        products.price,
        orders.quantity,
        orders.total,
        orders.status,
        orders.payment_status,
        orders.created_at
      FROM orders
      INNER JOIN products ON products.id = orders.product_id
      WHERE orders.id = $1
        AND orders.user_id = $2
    `;

  const params = isAdmin ? [orderId] : [orderId, userId];
  const result = await pool.query(query, params);

  if (result.rows.length === 0) {
    const error = new Error("Order not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const getOrders = async () => {
  const result = await pool.query(
    `
      SELECT
        orders.id,
        users.name AS user_name,
        users.email,
        products.name,
        products.image,
        products.price,
        orders.quantity,
        orders.total,
        orders.status,
        orders.payment_status,
        orders.created_at
      FROM orders
      INNER JOIN users ON users.id = orders.user_id
      INNER JOIN products ON products.id = orders.product_id
      ORDER BY orders.created_at DESC
    `
  );

  return result.rows;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const result = await pool.query(
    `
      UPDATE orders
      SET status=$1
      WHERE id=$2
      RETURNING *
    `,
    [status, orderId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Order not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const deleteOrder = async (orderId: number) => {
  const result = await pool.query(
    `
      DELETE FROM orders
      WHERE id=$1
      RETURNING *
    `,
    [orderId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Order not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return true;
};
