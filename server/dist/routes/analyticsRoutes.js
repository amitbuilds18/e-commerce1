import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();
// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Analytics Route Working",
    });
});
// Analytics Route
router.get("/", protect, authorize("superAdmin"), getAnalytics);
export default router;
