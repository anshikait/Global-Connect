import express from 'express';
import {
  createPost,
  getFeedPosts,
  toggleLikePost,
  addComment,
  sharePost,
  sendPost,
  getPostById,
  deletePost,
  getUserPosts
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadPostFiles } from '../config/multer.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Post routes
router.post('/', uploadPostFiles, createPost);
router.get('/feed', getFeedPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:postId', getPostById);
router.delete('/:postId', deletePost);

// Post interaction routes
router.post('/:postId/like', toggleLikePost);
router.post('/:postId/comment', addComment);
router.post('/:postId/share', sharePost);
router.post('/:postId/send', sendPost);

export default router;