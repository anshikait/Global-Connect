import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../config/multer.js';
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  getApplicationsReceived,
  updateApplicationStatus,
  saveCandidateProfile,
  removeSavedCandidate,
  // Job management
  createJob,
  getRecruiterJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
  // Dashboard stats
  getRecruiterStats,
  // Application management
  getJobApplications
} from '../controllers/recruiterController.js';

const router = express.Router();

// All routes are protected and for recruiters only
router.use(authenticate);
router.use(authorize('recruiter'));

// Profile routes
router.get('/profile', getRecruiterProfile);
router.put('/profile', upload.single('profileImage'), updateRecruiterProfile);
router.post('/logo', upload.single('logo'), uploadCompanyLogo);

// Dashboard stats
router.get('/stats', getRecruiterStats);

// Job management routes
router.post('/jobs', createJob);
router.get('/jobs', getRecruiterJobs);
router.get('/jobs/:jobId', getJobById);
router.put('/jobs/:jobId', updateJob);
router.delete('/jobs/:jobId', deleteJob);
router.patch('/jobs/:jobId/toggle-status', toggleJobStatus);

// Application management routes
router.get('/applications', getApplicationsReceived);
router.get('/jobs/:jobId/applications', getJobApplications);
router.patch('/applications/:applicationId/status', updateApplicationStatus);
router.put('/applications/:applicationId', updateApplicationStatus); // Legacy route

// Candidate management routes
router.post('/saved-candidates/:userId', saveCandidateProfile);
router.delete('/saved-candidates/:userId', removeSavedCandidate);

export default router;