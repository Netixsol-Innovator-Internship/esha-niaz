import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

import {
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserRole
} from "../controllers/userController.js";

const router = express.Router();

// Only admin & superAdmin can access users section
router.get("/", protect, adminOnly, getAllUsers);

// Admin & superAdmin can block/unblock users (controller enforces finer rules)
router.patch("/:id/block", protect, adminOnly, blockUser);
router.patch("/:id/unblock", protect, adminOnly, unblockUser);

// Admin & superAdmin can update roles (controller enforces finer rules)
router.patch("/:id/role", protect, adminOnly, updateUserRole);

export default router;
