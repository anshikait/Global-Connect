import express from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markMessagesAsRead,
  getUnreadCount
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Conversation routes
router.get('/conversations', getConversations);
router.get('/conversations/:participantId', getOrCreateConversation);
router.get('/unread-count', getUnreadCount);

// Message routes
router.get('/:conversationId/messages', getMessages);
router.post('/:conversationId/messages', sendMessage);
router.put('/messages/:messageId', editMessage);
router.delete('/messages/:messageId', deleteMessage);
router.patch('/:conversationId/read', markMessagesAsRead);

export default router;