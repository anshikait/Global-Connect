import User from '../models/User.js';
import Recruiter from '../models/Recruiter.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user or recruiter
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, industry } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role'
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

    // Validate role
    if (!['user', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either user or recruiter'
      });
    }

    // Additional validation for recruiters
    if (role === 'recruiter') {
      if (!companyName || !industry) {
        return res.status(400).json({
          success: false,
          message: 'Company name and industry are required for recruiters'
        });
      }
    }

    // Check if email already exists in both collections
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const existingRecruiter = await Recruiter.findOne({ email: email.toLowerCase() });
    
    if (existingUser || existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email'
      });
    }

    let newAccount;
    let token;
    //const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'user') {
      // Create user account
      newAccount = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password
      });

      token = generateToken(newAccount._id, 'user');

      res.status(201).json({
        success: true,
        message: 'User account created successfully',
        data: {
          user: {
            id: newAccount._id,
            name: newAccount.name,
            email: newAccount.email,
            role: 'user',
            isProfileComplete: newAccount.isProfileComplete,
            createdAt: newAccount.createdAt
          },
          token
        }
      });

    } else {
      // Create recruiter account
      newAccount = await Recruiter.create({
        name: companyName.trim(),
        companyName: companyName.trim(),
        email: email.toLowerCase(),
        password,
        industry: industry.trim()
      });

      token = generateToken(newAccount._id, 'recruiter');

      res.status(201).json({
        success: true,
        message: 'Recruiter account created successfully',
        data: {
          user: {
            id: newAccount._id,
            name: newAccount.companyName,
            email: newAccount.email,
            role: 'recruiter',
            companyName: newAccount.companyName,
            industry: newAccount.industry,
            isProfileComplete: newAccount.isProfileComplete,
            createdAt: newAccount.createdAt
          },
          token
        }
      });
    }


  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user or recruiter
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
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

    // Check in both User and Recruiter collections
    const user = await User.findOne({ email: emailLower }).select('+password');
    const recruiter = await Recruiter.findOne({ email: emailLower }).select('+password');

    let account = null;
    let accountType = null;

    if (user) {
      account = user;
      accountType = 'user';
    } else if (recruiter) {
      account = recruiter;
      accountType = 'recruiter';
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await account.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token with role
    const token = generateToken(account._id, accountType);

    // Update last login
    account.lastLogin = new Date();
    if (accountType === 'recruiter') {
      account.loginCount = (account.loginCount || 0) + 1;
    }
    await account.save();

    // Prepare response based on account type
    let userData;
    if (accountType === 'user') {
      userData = {
        id: account._id,
        name: account.name,
        email: account.email,
        role: 'user',
        bio: account.bio,
        profilePic: account.profilePic,
        jobTitle: account.jobTitle,
        location: account.location,
        skills: account.skills,
        isProfileComplete: account.isProfileComplete,
        lastLogin: account.lastLogin,
        createdAt: account.createdAt
      };
    } else {
      userData = {
        id: account._id,
        name: account.companyName,
        email: account.email,
        role: 'recruiter',
        companyName: account.companyName,
        companyDescription: account.companyDescription,
        industry: account.industry,
        companySize: account.companySize,
        website: account.website,
        headquarters: account.headquarters,
        profilePic: account.profilePic,
        isProfileComplete: account.isProfileComplete,
        isVerified: account.isVerified,
        lastLogin: account.lastLogin,
        createdAt: account.createdAt
      };
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connections', 'name email profilePic role')
      .populate('connectionRequests.from', 'name email profilePic role');

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};