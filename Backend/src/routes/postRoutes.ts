import express from 'express';
import PostController  from '../controllers/postController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();


// Create a new post
router.post('/create', protect, PostController.createPost.bind(PostController));

// Like a post
router.post('/posts/:postId/like',  PostController.likePost.bind(PostController));

export default router;
