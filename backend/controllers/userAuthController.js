import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists in both User and Recruiter collections
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    // Also import Recruiter model at the top
    const { default: Recruiter } = await import('../models/Recruiter.js');
    const existingRecruiter = await Recruiter.findOne({ email: email.toLowerCase() });
    
    if (existingUser || existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email'
      });
    }

    // Create user account
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password
    });

    const token = generateToken(newUser._id, 'user');

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: 'user',
          isProfileComplete: newUser.isProfileComplete,
          createdAt: newUser.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('User register error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    const emailLower = email.toLowerCase();

    // Find user and include password for comparison
    const user = await User.findOne({ email: emailLower }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id, 'user');

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      bio: user.bio,
      profilePic: user.profilePic,
      jobTitle: user.jobTitle,
      location: user.location,
      skills: user.skills,
      yearsOfExperience: user.yearsOfExperience,
      availabilityStatus: user.availabilityStatus,
      isProfileComplete: user.isProfileComplete,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/user/me
// @access  Private (Users only)
export const getUserProfile = async (req, res) => {
  try {
    // Double check that this is actually a user
    if (req.userRole !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This endpoint is for users only.'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      bio: user.bio,
      profilePic: user.profilePic,
      jobTitle: user.jobTitle,
      location: user.location,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      yearsOfExperience: user.yearsOfExperience,
      expectedSalary: user.expectedSalary,
      availabilityStatus: user.availabilityStatus,
      connections: user.connections,
      savedJobs: user.savedJobs,
      applications: user.applications,
      isProfileComplete: user.isProfileComplete,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Resume fields
      resume: user.resume,
      resumeOriginalName: user.resumeOriginalName,
      resumeUploadedAt: user.resumeUploadedAt
    };

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};