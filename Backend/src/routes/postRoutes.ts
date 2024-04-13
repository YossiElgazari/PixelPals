import express from "express";
import PostController from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();


// Create a new post
router.post("/", protect, PostController.createPost.bind(PostController));

// Like a post
router.post("/like", protect, PostController.likePost.bind(PostController));

// // Unlike a post
// router.delete('/unlike', protect,PostController.unlikePost.bind(PostController));

// // Delete a post
// router.delete('/', protect, PostController.deletePost.bind(PostController));

// // Update a post
// router.put('/', protect, PostController.updatePost.bind(PostController));

// // Get all posts of a user
// router.get('/user',protect, PostController.getAllUserPosts.bind(PostController));

// // Get all posts
// router.get('/', PostController.getAllPosts.bind(PostController));

export default router;
