import express from 'express';
import { register, login } from '../controllers/userController';

const router = express.Router();

// Registration endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

export default router;
