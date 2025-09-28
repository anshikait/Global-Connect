import express from 'express';
import {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile
} from '../controllers/recruiterAuthController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);

// Protected routes - Only recruiters can access
router.get('/me', authenticate, authorize('recruiter'), getRecruiterProfile);

export default router;