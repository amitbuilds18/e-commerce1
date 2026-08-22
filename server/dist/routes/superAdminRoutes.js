import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { 
// Admin
getAdmins, createAdmin, updateAdmin, deleteAdmin, 
// Users
getUsers, blockUser, deleteUser, } from "../controllers/superAdminController.js";
const router = express.Router();
// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Super Admin Route Working",
    });
});
// Middleware
router.use(protect);
router.use(authorize("superAdmin"));
/* ===========================
   Admin Management
=========================== */
router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);
/* ===========================
   User Management
=========================== */
router.get("/users", getUsers);
router.put("/users/:id/block", blockUser);
router.delete("/users/:id", deleteUser);
export default router;
