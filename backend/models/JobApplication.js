import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  applicantPhone: {
    type: String
  },
  applicantPhoto: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  coverLetter: {
    type: String
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobLocation: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter'
  },
  notes: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

// Index for better query performance
JobApplicationSchema.index({ recruiterId: 1, status: 1 });
JobApplicationSchema.index({ applicantId: 1, status: 1 });
JobApplicationSchema.index({ appliedAt: -1 });

// Note: Job and applicant details are now populated in the controller
// This ensures better error handling and explicit data population

// Post-save middleware to update job application count
JobApplicationSchema.post('save', async function() {
  try {
    const Job = mongoose.model('Job');
    const applicationCount = await mongoose.model('JobApplication').countDocuments({
      jobId: this.jobId
    });
    await Job.findByIdAndUpdate(this.jobId, { 
      applicantCount: applicationCount,
      $inc: { newApplications: this.isNew ? 1 : 0 }
    });
  } catch (error) {
    console.error('Error updating job application count:', error);
  }
});

// Post-remove middleware to update job application count
JobApplicationSchema.post('remove', async function() {
  try {
    const Job = mongoose.model('Job');
    const applicationCount = await mongoose.model('JobApplication').countDocuments({
      jobId: this.jobId
    });
    await Job.findByIdAndUpdate(this.jobId, { applicantCount: applicationCount });
  } catch (error) {
    console.error('Error updating job application count:', error);
  }
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;