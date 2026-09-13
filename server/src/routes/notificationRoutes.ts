import express from "express";

import {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("superAdmin"),
  getNotifications
);

router.post(
  "/",
  protect,
  authorize("superAdmin"),
  createNotification
);

router.put(
  "/:id",
  protect,
  authorize("superAdmin"),
  markAsRead
);

router.delete(
  "/:id",
  protect,
  authorize("superAdmin"),
  deleteNotification
);

export default router;