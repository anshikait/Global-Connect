import express from 'express';
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  getConnectionRequests,
  getUserConnections,
  getConnectionSuggestions,
  getNetworkStats,
  removeConnection
} from '../controllers/connectionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Connection management routes
router.post('/request/:recipientId', sendConnectionRequest);
router.patch('/request/:connectionId/respond', respondToConnectionRequest);
router.delete('/:connectionId', removeConnection);

// Get connection data
router.get('/requests', getConnectionRequests);
router.get('/my-connections', getUserConnections);
router.get('/suggestions', getConnectionSuggestions);
router.get('/stats', getNetworkStats);

export default router;