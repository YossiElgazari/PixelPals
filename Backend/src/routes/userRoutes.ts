import express from "express";
import UserController from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();

// Get User ID
router.get("/getId", protect, UserController.getUserId.bind(UserController));

// Get user profile
router.get(
  "/profile",
  protect,
  UserController.getuserprofile.bind(UserController)
);

// Get user profile by id
router.get(
  "/profile/:userId",
  protect,
  UserController.getuserprofilebyid.bind(UserController)
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
router.get(
  "/:userId",
  protect,
  UserController.getuserbyid.bind(UserController)
);

// Search users
router.get(
  "/search/:query",
  protect,
  UserController.searchusers.bind(UserController)
);

// Follow user
router.put(
  "/follow/:userId",
  protect,
  UserController.followUser.bind(UserController)
);

// Unfollow user
router.put(
  "/unfollow/:userId",
  protect,
  UserController.unfollowUser.bind(UserController)
);

// Get followers
router.get(
  "/followers/:userId",
  protect,
  UserController.getFollowers.bind(UserController)
);

// Get following
router.get(
  "/following/:userId",
  protect,
  UserController.getFollowing.bind(UserController)
);



export default router;
