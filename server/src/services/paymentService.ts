import Stripe from "stripe";
import pool from "../config/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export interface CreateCheckoutPayload {
  amount: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
}

export interface ConfirmPaymentPayload {
  session_id: string;
  cart: CartItem[];
  user_id: number;
}

export const createCheckoutSession = async (payload: CreateCheckoutPayload) => {
  if (!process.env.CLIENT_URL) {
    const error = new Error("CLIENT_URL is not configured.");
    (error as any).statusCode = 500;
    throw error;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: Math.round(payload.amount * 100),
          product_data: {
            name: "StyleHub Order",
          },
        },
      },
    ],
    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
  });

  return session.url;
};

export const confirmPayment = async (payload: ConfirmPaymentPayload) => {
  if (payload.cart.length === 0) {
    const error = new Error("Cart must contain at least one item.");
    (error as any).statusCode = 400;
    throw error;
  }

  const session = await stripe.checkout.sessions.retrieve(payload.session_id);
  if (session.payment_status !== "paid") {
    const error = new Error("Payment not completed.");
    (error as any).statusCode = 400;
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const ids = payload.cart.map((item) => item.id);
    const productRows = await client.query(
      "SELECT id, price FROM products WHERE id = ANY($1::int[])",
      [ids]
    );

    if (productRows.rows.length !== ids.length) {
      const error = new Error("One or more cart items are invalid.");
      (error as any).statusCode = 400;
      throw error;
    }

    const priceMap = new Map<number, number>();
    for (const row of productRows.rows) {
      priceMap.set(row.id, Number(row.price));
    }

    const expectedTotal = payload.cart.reduce((sum, item) => {
      const productPrice = priceMap.get(item.id) ?? 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const providedTotal = payload.cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    if (expectedTotal !== providedTotal) {
      const error = new Error("Cart totals do not match current product prices.");
      (error as any).statusCode = 400;
      throw error;
    }

    for (const item of payload.cart) {
      await client.query(
        `INSERT INTO orders
          (user_id, product_id, quantity, total, status, payment_status)
          VALUES($1,$2,$3,$4,$5,$6)`,
        [
          payload.user_id,
          item.id,
          item.quantity,
          priceMap.get(item.id)! * item.quantity,
          "Pending",
          "Paid",
        ]
      );
    }

    await client.query("COMMIT");
    return {
      success: true,
      message: "Payment confirmed and orders created.",
      orderCount: payload.cart.length,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};