import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const recruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    default: 'recruiter',
    immutable: true
  },
  // Company-specific fields
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyDescription: {
    type: String,
    maxlength: [1000, 'Company description cannot exceed 1000 characters'],
    default: ''
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Please enter a valid website URL'
    }
  },
  headquarters: {
    type: String,
    trim: true
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  profilePic: {
    type: String, // Company logo
    default: ''
  },
  
  // New dashboard profile fields
  profileImage: {
    type: String, // Personal profile image
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Please enter a valid website URL'
    }
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  linkedinUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(url);
      },
      message: 'Please enter a valid LinkedIn URL'
    }
  },

  // Contact information
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  // Job postings by this recruiter
  jobPostings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  // Applications received
  applicationsReceived: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    }
  }],
  // Saved candidate profiles
  savedCandidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Company benefits and perks
  benefits: [{
    type: String,
    trim: true
  }],
  // Social media links
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String, // URLs to verification documents
  }],
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // Subscription/Plan info (for future premium features)
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  // Activity tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
recruiterSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
recruiterSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if profile is complete
recruiterSchema.methods.checkProfileComplete = function() {
  const requiredFields = ['companyName', 'industry', 'companyDescription', 'headquarters'];
  const isComplete = requiredFields.every(field => this[field] && this[field].toString().trim() !== '');
  this.isProfileComplete = isComplete;
  return isComplete;
};

// Update login activity
recruiterSchema.methods.updateLoginActivity = function() {
  this.lastLogin = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  return this.save();
};

// Remove password from JSON output
recruiterSchema.methods.toJSON = function() {
  const recruiterObject = this.toObject();
  delete recruiterObject.password;
  return recruiterObject;
};

// Index for search optimization
recruiterSchema.index({ companyName: 'text', industry: 'text', headquarters: 'text' });
recruiterSchema.index({ isActive: 1, isVerified: 1 });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;