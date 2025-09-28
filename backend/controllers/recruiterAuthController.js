import Recruiter from '../models/Recruiter.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register recruiter
// @route   POST /api/auth/recruiter/register
// @access  Public
export const registerRecruiter = async (req, res) => {
  try {
    const { companyName, email, password, industry } = req.body;

    // Validation
    if (!companyName || !email || !password || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, email, password, and industry'
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

    // Check if email already exists in both Recruiter and User collections
    const existingRecruiter = await Recruiter.findOne({ email: email.toLowerCase() });
    
    // Also import User model at the top
    const { default: User } = await import('../models/User.js');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingRecruiter || existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email'
      });
    }

    // Create recruiter account
    const newRecruiter = await Recruiter.create({
      name: companyName.trim(),
      companyName: companyName.trim(),
      email: email.toLowerCase(),
      password,
      industry: industry.trim()
    });

    const token = generateToken(newRecruiter._id, 'recruiter');

    res.status(201).json({
      success: true,
      message: 'Recruiter account created successfully',
      data: {
        user: {
          id: newRecruiter._id,
          name: newRecruiter.companyName,
          email: newRecruiter.email,
          role: 'recruiter',
          companyName: newRecruiter.companyName,
          industry: newRecruiter.industry,
          isProfileComplete: newRecruiter.isProfileComplete,
          createdAt: newRecruiter.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Recruiter register error:', error);
    
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

// @desc    Login recruiter
// @route   POST /api/auth/recruiter/login
// @access  Public
export const loginRecruiter = async (req, res) => {
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

    // Find recruiter and include password for comparison
    const recruiter = await Recruiter.findOne({ email: emailLower }).select('+password');

    if (!recruiter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await recruiter.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(recruiter._id, 'recruiter');

    // Update login activity
    await recruiter.updateLoginActivity();

    // Prepare recruiter data for response
    const recruiterData = {
      id: recruiter._id,
      name: recruiter.companyName,
      email: recruiter.email,
      role: 'recruiter',
      companyName: recruiter.companyName,
      companyDescription: recruiter.companyDescription,
      industry: recruiter.industry,
      companySize: recruiter.companySize,
      website: recruiter.website,
      headquarters: recruiter.headquarters,
      foundedYear: recruiter.foundedYear,
      profilePic: recruiter.profilePic,
      contactPerson: recruiter.contactPerson,
      benefits: recruiter.benefits,
      socialMedia: recruiter.socialMedia,
      isProfileComplete: recruiter.isProfileComplete,
      isVerified: recruiter.isVerified,
      isActive: recruiter.isActive,
      subscriptionPlan: recruiter.subscriptionPlan,
      lastLogin: recruiter.lastLogin,
      loginCount: recruiter.loginCount,
      createdAt: recruiter.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: recruiterData,
        token
      }
    });

  } catch (error) {
    console.error('Recruiter login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get recruiter profile
// @route   GET /api/auth/recruiter/me
// @access  Private (Recruiters only)
export const getRecruiterProfile = async (req, res) => {
  try {
    // Double check that this is actually a recruiter
    if (req.userRole !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This endpoint is for recruiters only.'
      });
    }

    const recruiter = await Recruiter.findById(req.user.id)
      .populate('jobPostings')
      .populate('savedCandidates', 'name email jobTitle location profilePic');
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    const recruiterData = {
      id: recruiter._id,
      name: recruiter.companyName,
      email: recruiter.email,
      role: 'recruiter',
      companyName: recruiter.companyName,
      companyDescription: recruiter.companyDescription,
      industry: recruiter.industry,
      companySize: recruiter.companySize,
      website: recruiter.website,
      headquarters: recruiter.headquarters,
      foundedYear: recruiter.foundedYear,
      profilePic: recruiter.profilePic,
      contactPerson: recruiter.contactPerson,
      jobPostings: recruiter.jobPostings,
      applicationsReceived: recruiter.applicationsReceived,
      savedCandidates: recruiter.savedCandidates,
      benefits: recruiter.benefits,
      socialMedia: recruiter.socialMedia,
      isProfileComplete: recruiter.isProfileComplete,
      isVerified: recruiter.isVerified,
      isActive: recruiter.isActive,
      subscriptionPlan: recruiter.subscriptionPlan,
      subscriptionExpiry: recruiter.subscriptionExpiry,
      lastLogin: recruiter.lastLogin,
      loginCount: recruiter.loginCount,
      createdAt: recruiter.createdAt,
      updatedAt: recruiter.updatedAt
    };

    res.status(200).json({
      success: true,
      data: {
        user: recruiterData
      }
    });

  } catch (error) {
    console.error('Get recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};