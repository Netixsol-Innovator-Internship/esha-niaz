// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { errors } from "../utils/responses.js";

dotenv.config();

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: errors.NO_TOKEN });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user
    const user = await User.findById(decoded.id || decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: errors.USER_NOT_FOUND });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: errors.ACCOUNT_BLOCKED });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: errors.INVALID_TOKEN });
  }
};

// Allow admin and superAdmin
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
    next();
  } else {
    return res.status(403).json({ success: false, message: errors.ADMIN_ONLY });
  }
};

// Allow only superAdmin
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superAdmin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: errors.SUPERADMIN_ONLY });
  }
};
