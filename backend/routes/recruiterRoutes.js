import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  getApplicationsReceived,
  updateApplicationStatus,
  saveCandidateProfile,
  removeSavedCandidate
} from '../controllers/recruiterController.js';

const router = express.Router();

// All routes are protected and for recruiters only
router.use(authenticate);
router.use(authorize(['recruiter']));

// Profile routes
router.get('/profile', getRecruiterProfile);
router.put('/profile', updateRecruiterProfile);
router.post('/logo', upload.single('logo'), uploadCompanyLogo);

// Application management routes
router.get('/applications', getApplicationsReceived);
router.put('/applications/:applicationId', updateApplicationStatus);

// Candidate management routes
router.post('/saved-candidates/:userId', saveCandidateProfile);
router.delete('/saved-candidates/:userId', removeSavedCandidate);

export default router;