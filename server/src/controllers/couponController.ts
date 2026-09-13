import { Request, Response } from "express";

interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minCartValue: number;
  maxDiscount?: number;
  description: string;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  STYLE20: {
    code: "STYLE20",
    type: "percentage",
    value: 20,
    minCartValue: 1000,
    maxDiscount: 1000,
    description: "20% off on orders above ₹1,000 (Max ₹1,000)",
  },
  FIRST500: {
    code: "FIRST500",
    type: "fixed",
    value: 500,
    minCartValue: 2500,
    description: "Flat ₹500 off on orders above ₹2,500",
  },
  FASHION10: {
    code: "FASHION10",
    type: "percentage",
    value: 10,
    minCartValue: 0,
    maxDiscount: 500,
    description: "10% off on all orders",
  },
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid coupon code.",
      });
    }

    const total = Number(cartTotal);
    if (isNaN(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart total must be greater than zero.",
      });
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[normalizedCode];

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code. Try STYLE20, FIRST500, or FASHION10.",
      });
    }

    if (total < coupon.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minCartValue}.`,
      });
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round((total * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    const discountedTotal = Math.max(0, total - discountAmount);

    return res.json({
      success: true,
      code: coupon.code,
      discountAmount,
      newTotal: discountedTotal,
      message: `Coupon ${coupon.code} applied successfully! You saved ₹${discountAmount}.`,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to validate coupon code.",
    });
  }
};
