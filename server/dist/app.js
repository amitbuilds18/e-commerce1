import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
const app = express();
// Security Headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// CORS
app.use(cors());
// Global API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Strict Auth Limiter (Brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
// Parse JSON Body
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/super-admin", superAdminRoutes);
// Health Check Probe Endpoint
app.get("/api/health", async (req, res) => {
    try {
        const start = Date.now();
        await pool.query("SELECT 1");
        const dbLatency = Date.now() - start;
        res.json({
            status: "ok",
            uptime: process.uptime(),
            database: "connected",
            dbLatencyMs: dbLatency,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(503).json({
            status: "error",
            database: "disconnected",
            error: err.message,
        });
    }
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "StyleHub Backend Running 🚀",
    });
});
app.use(errorHandler);
export default app;
