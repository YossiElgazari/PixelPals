import express from "express";
import UserController from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to users
 */

/**
 * @swagger
 * /users/getId:
 *   get:
 *     summary: Get User ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user ID
 */
router.get("/getId", protect, UserController.getUserId.bind(UserController));

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 */
router.get(
  "/profile",
  protect,
  UserController.getuserprofile.bind(UserController)
);

/**
 * @swagger
 * /users/profile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve profile
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile by ID
 */
router.get(
  "/profile/:userId",
  protect,
  UserController.getuserprofilebyid.bind(UserController)
);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put(
  "/profile",
  protect,
  UserController.updateuserprofile.bind(UserController)
);

/**
 * @swagger
 * /users/reset-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: User password updated successfully
 */
router.put(
  "/reset-password",
  protect,
  UserController.updatepassword.bind(UserController)
);

/**
 * @swagger
 * /users/profilePicture:
 *   put:
 *     summary: Update user profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile picture updated successfully
 */
router.put(
  "/profilePicture",
  protect,
  UserController.updateprofilepicture.bind(UserController)
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 */
router.get(
  "/:userId",
  protect,
  UserController.getuserbyid.bind(UserController)
);

/**
 * @swagger
 * /users/search/{query}:
 *   get:
 *     summary: Search users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Successfully retrieved users matching the search query
 */
router.get(
  "/search/:query",
  protect,
  UserController.searchusers.bind(UserController)
);

/**
 * @swagger
 * /users/follow/{userId}:
 *   put:
 *     summary: Follow user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 */
router.put(
  "/follow/:userId",
  protect,
  UserController.followUser.bind(UserController)
);

/**
 * @swagger
 * /users/unfollow/{userId}:
 *   put:
 *     summary: Unfollow user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 */
router.put(
  "/unfollow/:userId",
  protect,
  UserController.unfollowUser.bind(UserController)
);

/**
 * @swagger
 * /users/followers/{userId}:
 *   get:
 *     summary: Get followers of a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve followers
 *     responses:
 *       200:
 *         description: Successfully retrieved followers of the user
 */
router.get(
  "/followers/:userId",
  protect,
  UserController.getFollowers.bind(UserController)
);

/**
 * @swagger
 * /users/following/{userId}:
 *   get:
 *     summary: Get users followed by a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve users followed
 *     responses:
 *       200:
 *         description: Successfully retrieved users followed by the user
 */
router.get(
  "/following/:userId",
  protect,
  UserController.getFollowing.bind(UserController)
);

export default router;
