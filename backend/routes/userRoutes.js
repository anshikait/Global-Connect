import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../config/multer.js';
import {
  getUserProfile,
  getUserProfileById,
  updateUserProfile,
  uploadProfilePicture,
  uploadResume,
  deleteResume,
  getAllJobs,
  applyForJob,
  getUserApplications,
  sendConnectionRequest,
  respondToConnectionRequest,
  getDashboardStats,
  getSavedJobs,
  toggleSaveJob
} from '../controllers/userController.js';

const router = express.Router();

// All routes are protected and for users only
router.use(authenticate);
router.use(authorize('user'));

// Profile routes
router.get('/profile', getUserProfile);
router.get('/profile/:userId', getUserProfileById);
router.put('/profile', updateUserProfile);
router.post('/profile-pic', upload.single('profilePic'), uploadProfilePicture);

// Resume routes
router.post('/resume', upload.single('resume'), uploadResume);
router.delete('/resume', deleteResume);

// Job application routes
router.get('/jobs', getAllJobs);
router.post('/apply/:jobId', applyForJob);
router.get('/applications', getUserApplications);

// Connection routes
router.post('/connect/:targetUserId', sendConnectionRequest);
router.put('/connection-requests/:requestId', respondToConnectionRequest);

// Dashboard and statistics routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/saved-jobs', getSavedJobs);
router.post('/jobs/:jobId/save', toggleSaveJob);

export default router;
