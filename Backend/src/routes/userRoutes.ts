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

export default router;
