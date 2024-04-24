import express from "express";
import PostController from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();


// Create a new post
router.post("/", protect, PostController.create.bind(PostController));

// Delete a post
router.delete('/:id', protect, PostController.delete.bind(PostController));

// Update a post
router.put('/:id', protect, PostController.update.bind(PostController));

// Get all posts of a user
router.get('/user',protect, PostController.getAllUserPosts.bind(PostController));

// Get all posts by order of createdAt
router.get('/', protect, PostController.getAllByOrder.bind(PostController));

// Get a post
router.get('/:id', protect, PostController.getById.bind(PostController));

// Like a post
router.put('/like/:id', protect, PostController.likePost.bind(PostController));

// Unlike a post
router.put('/unlike/:id', protect, PostController.unlikePost.bind(PostController));

export default router;
