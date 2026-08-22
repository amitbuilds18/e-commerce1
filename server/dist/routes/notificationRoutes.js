import express from "express";
import { getNotifications, markAsRead, } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();
router.get("/", protect, authorize("superAdmin"), getNotifications);
router.put("/:id", protect, authorize("superAdmin"), markAsRead);
export default router;
