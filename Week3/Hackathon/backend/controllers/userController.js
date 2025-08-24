// backend/controllers/userController.js
import User from "../models/User.js";
import { success, errors } from "../utils/responses.js";

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      message: success.USERS_RETRIEVED,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};

// PATCH /api/users/:id/role
// PATCH /api/users/:id/role
// PATCH /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const currentUser = await User.findById(req.user.id);   // logged-in user
    const targetUser = await User.findById(id);             // user being updated

    if (!targetUser) {
      return res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
    }

    // SuperAdmin rules
    if (currentUser.role === "superAdmin") {
      if (targetUser.email === process.env.SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ success: false, message: errors.FORBIDDEN_ROLE_CHANGE });
      }
      targetUser.role = role;
      await targetUser.save();
      return res.json({
        success: true,
        message: success.USER_ROLE_UPDATED,
        data: targetUser,
      });
    }

    // Admin rules
    if (currentUser.role === "admin") {
      if (targetUser.role === "superAdmin") {
        return res.status(403).json({ success: false, message: "Admins cannot change SuperAdmin roles" });
      }
      if (targetUser.role === "admin") {
        return res.status(403).json({ success: false, message: "Admins cannot change roles of other admins" });
      }
      if (targetUser.role === "user" && role === "admin") {
        targetUser.role = "admin";
        await targetUser.save();
        return res.json({
          success: true,
          message: "User promoted to admin",
          data: targetUser,
        });
      }
      return res.status(403).json({
        success: false,
        message: "Admins can only promote users to admin",
      });
    }

    return res.status(403).json({ success: false, message: errors.UNAUTHORIZED });
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};



// PATCH /api/users/:id/block
// export const blockUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
//     }

//     if (req.user.role === "admin") {
//       if (user.role !== "user") {
//         return res.status(403).json({ success: false, message: "Admins can only block normal users" });
//       }
//     }

//     if (user.role === "superAdmin") {
//       return res.status(403).json({ success: false, message: errors.CANNOT_BLOCK_SUPERADMIN });
//     }

//     user.isBlocked = true;
//     await user.save();

//     res.json({ success: true, message: success.USER_BLOCKED });
//   } catch (error) {
//     res.status(500).json({ success: false, message: errors.SERVER_ERROR });
//   }
// };


// // PATCH /api/users/:id/unblock
// export const unblockUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
//     }

//     if (req.user.role === "admin") {
//       if (user.role !== "user") {
//         return res.status(403).json({ success: false, message: "Admins can only unblock normal users" });
//       }
//     }

//     user.isBlocked = false;
//     await user.save();

//     res.json({ success: true, message: success.USER_UNBLOCKED });
//   } catch (error) {
//     res.status(500).json({ success: false, message: errors.SERVER_ERROR });
//   }
// };


// PATCH /api/users/:id/block
// PATCH /api/users/:id/block
export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
    }

    // SuperAdmin cannot be blocked by anyone
    if (user.role === "superAdmin") {
      return res.status(403).json({ success: false, message: errors.CANNOT_BLOCK_SUPERADMIN });
    }

    // Admin trying to block others
    if (req.user.role === "admin") {
      if (user.role !== "user") {
        return res.status(403).json({
          success: false,
          message: "Admins can only block normal users, not admins or superAdmins",
        });
      }
    }

    user.isBlocked = true;
    await user.save();

    res.json({ success: true, message: success.USER_BLOCKED });
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};

// PATCH /api/users/:id/unblock
export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
    }

    // Admin trying to unblock others
    if (req.user.role === "admin") {
      if (user.role !== "user") {
        return res.status(403).json({
          success: false,
          message: "Admins can only unblock normal users, not admins or superAdmins",
        });
      }
    }

    user.isBlocked = false;
    await user.save();

    res.json({ success: true, message: success.USER_UNBLOCKED });
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};


