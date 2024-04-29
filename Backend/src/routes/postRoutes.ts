import express from "express";
import PostController from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Operations related to posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/", protect, PostController.create.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:id', protect, PostController.delete.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:id', protect, PostController.update.bind(PostController));

/**
 * @swagger
 * /posts/user:
 *   get:
 *     summary: Get all posts of a user
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/user', protect, PostController.getAllUserPosts.bind(PostController));

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts by order of createdAt
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', protect, PostController.getAllByOrder.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get('/:id', protect, PostController.getById.bind(PostController));

/**
 * @swagger
 * /posts/like/{id}:
 *   put:
 *     summary: Like a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
router.put('/like/:id', protect, PostController.likePost.bind(PostController));

/**
 * @swagger
 * /posts/unlike/{id}:
 *   put:
 *     summary: Unlike a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 */
router.put('/unlike/:id', protect, PostController.unlikePost.bind(PostController));

export default router;
