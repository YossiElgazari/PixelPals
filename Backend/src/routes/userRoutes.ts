import express from 'express';
import UserController from '../controllers/userController';
import {protect} from '../middlewares/authMiddleware';
const router = express.Router();


// Registration endpoint
router.post('/register', UserController.register.bind(UserController));

// Login endpoint
router.post('/login', UserController.login.bind(UserController));   

// Logout endpoint
router.get('/logout', protect, UserController.logout.bind(UserController)); 

// Get user profile
router.get('/profile', protect, UserController.getuserprofile.bind(UserController));

export default router;
