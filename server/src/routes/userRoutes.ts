import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getProfile, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/", protect, authorize("admin", "superAdmin"), getUsers);

export default router;