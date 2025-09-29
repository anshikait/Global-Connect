import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  level: {
    type: String,
    required: true,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'entry'
  },
  salary: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  benefits: {
    type: String
  },
  skills: [{
    type: String,
    trim: true
  }],
  isRemote: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  applicantCount: {
    type: Number,
    default: 0
  },
  newApplications: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
JobSchema.index({ recruiterId: 1, isActive: 1 });
JobSchema.index({ title: 'text', description: 'text', requirements: 'text' });
JobSchema.index({ location: 1, type: 1, level: 1 });

// Virtual for application count
JobSchema.virtual('applications', {
  ref: 'JobApplication',
  localField: '_id',
  foreignField: 'jobId'
});

// Pre-save middleware to set company name from recruiter
JobSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('recruiterId')) {
    try {
      const Recruiter = mongoose.model('Recruiter');
      const recruiter = await Recruiter.findById(this.recruiterId);
      if (recruiter && recruiter.companyName) {
        this.companyName = recruiter.companyName;
      }
    } catch (error) {
      console.error('Error setting company name:', error);
    }
  }
  next();
});

const Job = mongoose.model('Job', JobSchema);

export default Job;