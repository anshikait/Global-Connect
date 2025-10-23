import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js'
import scheduleAwake from './utils/cronScheduler.js';

// Model imports (to ensure they're loaded)
import './models/User.js';
import './models/Recruiter.js';
import './models/Job.js';
import './models/JobApplication.js';
import './models/Post.js';
import './models/Connection.js';
import './models/Message.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userAuthRoutes from './routes/userAuthRoutes.js';
import recruiterAuthRoutes from './routes/recruiterAuthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import postRoutes from './routes/postRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available to routes
app.set('io', io);

// Connect to database
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Middleware
app.use(cookieParser());
app.use(cors());

// Disable caching
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (resumes and other uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes); // Legacy routes
app.use('/api/auth/user', userAuthRoutes); // Dedicated user auth routes
app.use('/api/auth/recruiter', recruiterAuthRoutes); // Dedicated recruiter auth routes
app.use('/api/users', userRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/jobs', jobRoutes); // Public job routes

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Global Connect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining their room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined their room`);
  });

  // Handle joining conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Handle leaving conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User left conversation: ${conversationId}`);
  });

  // Handle user typing indicator
  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from connected users map
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO enabled for real-time messaging`);
  
  // Start cron scheduler for keep-alive functionality
  scheduleAwake();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
  process.exit(1);
});

export default app;
