import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  applyForJob,
  getUserApplications,
  sendConnectionRequest,
  respondToConnectionRequest
} from '../controllers/userController.js';

const router = express.Router();

// All routes are protected and for users only
router.use(authenticate);
router.use(authorize(['user']));

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile-pic', upload.single('profilePic'), uploadProfilePicture);

// Job application routes
router.post('/apply/:jobId', applyForJob);
router.get('/applications', getUserApplications);

// Connection routes
router.post('/connect/:targetUserId', sendConnectionRequest);
router.put('/connection-requests/:requestId', respondToConnectionRequest);

export default router;