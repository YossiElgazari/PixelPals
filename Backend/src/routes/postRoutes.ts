import express from 'express';
import postController from '../controllers/postController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Create a new post
router.post('/posts', protect, postController.createPost);

// Like a post
router.post('/posts/:postId/like', protect, postController.likePost);

export default router;
