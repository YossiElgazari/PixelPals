import express from "express";
import UserController from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();

// Get user profile
router.get(
  "/profile",
  protect,
  UserController.getuserprofile.bind(UserController)
);

// Update user profile
router.put(
  "/profile",
  protect,
  UserController.updateuserprofile.bind(UserController)
);

// Update user password
router.put(
  "/reset-password",
  protect,
  UserController.updatepassword.bind(UserController)
);

// Update user profile picture
router.put(
  "/profilePicture",
  protect,
  UserController.updateprofilepicture.bind(UserController)
);

// Get user by ID
router.get("/:userId", protect, UserController.getuserbyid.bind(UserController));

export default router;
