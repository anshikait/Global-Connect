import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  changePassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, changePassword);

export default router;