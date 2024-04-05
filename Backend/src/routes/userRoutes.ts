import express from 'express';
import { register, login, getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Profile endpoint
router.get('/profile', protect, getUserProfile);

// Profile update endpoint
router.put('/profile', protect, updateUserProfile);

export default router;
