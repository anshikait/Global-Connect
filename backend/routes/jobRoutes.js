import express from 'express';
import { getPublicJobs } from '../controllers/publicController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/public', getPublicJobs);

export default router;