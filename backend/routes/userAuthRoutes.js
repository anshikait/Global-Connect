import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/userAuthController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - Only users can access
router.get('/me', authenticate, authorize('user'), getUserProfile);

export default router;