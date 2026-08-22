import Stripe from "stripe";
import { Response } from "express";
import pool from "../config/db.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

interface CheckoutItem {
  id: number;
  quantity: number;
}

const getServerCart = async (items: CheckoutItem[]) => {
  const productIds = [...new Set(items.map((item) => item.id))];
  const result = await pool.query(
    "SELECT id, name, price FROM products WHERE id = ANY($1::int[])",
    [productIds]
  );

  if (result.rows.length !== productIds.length) {
    const error = new Error("One or more products are no longer available.");
    (error as any).statusCode = 400;
    throw error;
  }

  const products = new Map(result.rows.map((product) => [product.id, product]));
  return items.map((item) => {
    const product = products.get(item.id)!;
    return {
      id: item.id,
      quantity: item.quantity,
      name: product.name,
      price: Number(product.price),
    };
  });
};

const calculateTotal = (cart: Array<{ price: number; quantity: number }>) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const gst = Math.round(subtotal * 0.18);
  return subtotal + shipping + gst;
};

// ================================
// CREATE CHECKOUT SESSION
// ================================

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const items = req.body?.cart;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A non-empty cart is required.",
      });
    }

    const requestedItems: CheckoutItem[] = items.map((item: any) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    if (requestedItems.some((item) => !Number.isInteger(item.id) || item.id <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      return res.status(400).json({ success: false, message: "Cart items are invalid." });
    }

    const cart = await getServerCart(requestedItems);
    const total = calculateTotal(cart);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: total * 100,
            product_data: {
              name: "StyleHub Order",
            },
          },
        },
      ],

      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-cancel`,
      client_reference_id: String(userId),
      metadata: {
        cart: JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))),
      },
    });

    return res.json({
      success: true,
      url: session.url,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to create checkout session.",
    });
  }
};

// ================================
// CONFIRM PAYMENT
// ================================

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { session_id: sessionId } = req.body || {};

    if (!userId || typeof sessionId !== "string" || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" || session.client_reference_id !== String(userId)) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified.",
      });
    }

    const storedCart = JSON.parse(session.metadata?.cart || "[]") as CheckoutItem[];
    if (!Array.isArray(storedCart) || storedCart.length === 0) {
      return res.status(400).json({ success: false, message: "Payment cart is invalid." });
    }

    const cart = await getServerCart(storedCart);
    const expectedTotal = calculateTotal(cart);
    if (session.amount_total !== expectedTotal * 100) {
      return res.status(400).json({ success: false, message: "Payment amount does not match the order." });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `CREATE TABLE IF NOT EXISTS payment_confirmations (
          session_id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      );
      const confirmation = await client.query(
        "INSERT INTO payment_confirmations(session_id, user_id) VALUES($1, $2) ON CONFLICT (session_id) DO NOTHING RETURNING session_id",
        [sessionId, userId]
      );

      if (confirmation.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.json({ success: true, message: "Payment was already confirmed." });
      }

      for (const item of cart) {
        await client.query(
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
        `,
          [userId, item.id, item.quantity, item.price * item.quantity, "Pending", "Paid"]
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    return res.json({
      success: true,
      message: "Payment successful.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to confirm payment.",
    });
  }
};