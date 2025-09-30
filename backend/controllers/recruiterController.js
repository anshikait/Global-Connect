import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
// @access  Private (Recruiters only)
export const getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id)
      .populate('jobPostings')
      .populate('savedCandidates', 'name email profilePic jobTitle location skills');

    res.status(200).json({
      success: true,
      data: { recruiter }
    });

  } catch (error) {
    console.error('Get recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private (Recruiters only)
export const updateRecruiterProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      companyName,
      companyWebsite,
      companySize,
      industry,
      location,
      bio,
      linkedinUrl,
      // Legacy fields for backward compatibility
      companyDescription,
      website,
      headquarters,
      foundedYear,
      contactPerson,
      benefits,
      socialMedia
    } = req.body;

    const recruiter = await Recruiter.findById(req.user.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    // Handle profile image upload if present
    if (req.file) {
      try {
        // Delete old profile image if exists
        if (recruiter.profileImage) {
          try {
            const urlParts = recruiter.profileImage.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            const folderPath = urlParts.slice(-2, -1)[0]; // Get folder name
            await cloudinary.v2.uploader.destroy(`${folderPath}/${publicId}`);
          } catch (deleteError) {
            console.error('Error deleting old profile image:', deleteError);
          }
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'global-connect/recruiter-profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
        recruiter.profileImage = result.secure_url;
        console.log('Profile image uploaded successfully:', result.secure_url);
      } catch (uploadError) {
        console.error('Profile image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading profile image'
        });
      }
    }

    // Update dashboard profile fields
    if (name !== undefined) recruiter.name = name.trim();
    if (email !== undefined) recruiter.email = email.trim();
    if (phone !== undefined) recruiter.phone = phone.trim();
    if (companyName !== undefined) recruiter.companyName = companyName.trim();
    if (companyWebsite !== undefined) recruiter.companyWebsite = companyWebsite.trim();
    if (companySize !== undefined) recruiter.companySize = companySize;
    if (industry !== undefined) recruiter.industry = industry.trim();
    if (location !== undefined) recruiter.location = location.trim();
    if (bio !== undefined) recruiter.bio = bio.trim();
    if (linkedinUrl !== undefined) recruiter.linkedinUrl = linkedinUrl.trim();

    // Legacy fields for backward compatibility
    if (companyDescription !== undefined) recruiter.companyDescription = companyDescription.trim();
    if (website !== undefined) recruiter.website = website.trim();
    if (headquarters !== undefined) recruiter.headquarters = headquarters.trim();
    if (foundedYear !== undefined) recruiter.foundedYear = foundedYear;

    // Update contact person
    if (contactPerson) {
      recruiter.contactPerson = {
        name: contactPerson.name?.trim() || recruiter.contactPerson?.name,
        position: contactPerson.position?.trim() || recruiter.contactPerson?.position,
        phone: contactPerson.phone?.trim() || recruiter.contactPerson?.phone
      };
    }

    // Update benefits
    if (benefits && Array.isArray(benefits)) {
      recruiter.benefits = benefits.map(benefit => benefit.trim()).filter(benefit => benefit);
    }

    // Update social media
    if (socialMedia) {
      recruiter.socialMedia = {
        linkedin: socialMedia.linkedin?.trim() || recruiter.socialMedia?.linkedin,
        twitter: socialMedia.twitter?.trim() || recruiter.socialMedia?.twitter,
        facebook: socialMedia.facebook?.trim() || recruiter.socialMedia?.facebook,
        instagram: socialMedia.instagram?.trim() || recruiter.socialMedia?.instagram
      };
    }

    // Check if profile is complete
    if (recruiter.checkProfileComplete) {
      recruiter.checkProfileComplete();
    }

    await recruiter.save();

    console.log('Recruiter profile updated successfully:', {
      id: recruiter._id,
      profileImage: recruiter.profileImage,
      profilePic: recruiter.profilePic,
      name: recruiter.name
    });

    res.status(200).json({
      success: true,
      message: 'Recruiter profile updated successfully',
      data: { 
        user: recruiter,
        recruiter: recruiter // Include both for compatibility
      }
    });

  } catch (error) {
    console.error('Update recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload company logo
// @route   POST /api/recruiters/logo
// @access  Private (Recruiters only)
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const recruiter = await Recruiter.findById(req.user.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    // Delete old logo from cloudinary if exists
    if (recruiter.profilePic) {
      try {
        const urlParts = recruiter.profilePic.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const folderPath = urlParts.slice(-2, -1)[0]; // Get folder name
        await cloudinary.v2.uploader.destroy(`${folderPath}/${publicId}`);
      } catch (deleteError) {
        console.error('Error deleting old logo:', deleteError);
      }
    }

    // Upload new logo to cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'global-connect/company-logos',
      transformation: [
        { width: 300, height: 300, crop: 'fit' },
        { quality: 'auto' }
      ]
    });

    // Update recruiter logo URL
    recruiter.profilePic = result.secure_url;
    await recruiter.save();

    console.log('Company logo uploaded successfully:', result.secure_url);

    res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully',
      data: {
        logoUrl: recruiter.profilePic,
        recruiter: {
          profilePic: recruiter.profilePic,
          profileImage: recruiter.profileImage
        }
      }
    });

  } catch (error) {
    console.error('Upload company logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Get job applications received
// @route   GET /api/recruiters/applications
// @access  Private (Recruiters only)
export const getApplicationsReceived = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const recruiterId = req.user.id;

    // Build query
    let query = { recruiterId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get total count for pagination
    const totalApplications = await JobApplication.countDocuments(query);

    // Get applications with pagination
    const applicationsData = await JobApplication.find(query)
      .populate({
        path: 'applicantId',
        select: 'name email profileImage phone'
      })
      .populate({
        path: 'jobId',
        select: 'title location companyName'
      })
      .sort({ appliedAt: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Format applications for frontend
    const applications = applicationsData.map(app => ({
      _id: app._id,
      applicantName: app.applicantId?.name || 'Unknown Applicant',
      applicantEmail: app.applicantId?.email || '',
      applicantProfileImage: app.applicantId?.profileImage || '',
      applicantPhone: app.applicantId?.phone || '',
      jobTitle: app.jobId?.title || 'Unknown Job',
      jobLocation: app.jobId?.location || '',
      companyName: app.jobId?.companyName || '',
      status: app.status,
      appliedAt: app.appliedAt,
      resumeUrl: app.resumeUrl,
      coverLetter: app.coverLetter,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.status(200).json({
      success: true,
      applications,
      totalApplications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalApplications / limit)
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/recruiters/applications/:applicationId
// @access  Private (Recruiters only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log('Updating application status:', { applicationId, status });

    if (!['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid values: pending, accepted, rejected, withdrawn'
      });
    }

    // Find the application and verify it belongs to this recruiter
    const application = await JobApplication.findOne({
      _id: applicationId,
      recruiterId: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or not authorized'
      });
    }

    // Update the application status
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;
    
    await application.save();

    console.log('Application status updated successfully:', application._id);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add candidate to saved list
// @route   POST /api/recruiters/saved-candidates/:userId
// @access  Private (Recruiters only)
export const saveCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const recruiter = await Recruiter.findById(req.user.id);

    if (recruiter.savedCandidates.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Candidate already saved'
      });
    }

    recruiter.savedCandidates.push(userId);
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Candidate saved successfully'
    });

  } catch (error) {
    console.error('Save candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove candidate from saved list
// @route   DELETE /api/recruiters/saved-candidates/:userId
// @access  Private (Recruiters only)
export const removeSavedCandidate = async (req, res) => {
  try {
    const { userId } = req.params;

    const recruiter = await Recruiter.findById(req.user.id);
    recruiter.savedCandidates = recruiter.savedCandidates.filter(
      candidateId => candidateId.toString() !== userId
    );
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Candidate removed from saved list'
    });

  } catch (error) {
    console.error('Remove saved candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ========== NEW DASHBOARD FUNCTIONALITY ==========

// @desc    Get recruiter dashboard stats
// @route   GET /api/recruiters/stats
// @access  Private (Recruiters only)
export const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get job stats
    const totalJobs = await Job.countDocuments({ recruiterId });
    const activeJobs = await Job.countDocuments({ recruiterId, isActive: true });

    // Get application stats
    const totalApplications = await JobApplication.countDocuments({ recruiterId });
    const pendingApplications = await JobApplication.countDocuments({ 
      recruiterId, 
      status: 'pending' 
    });
    const acceptedApplications = await JobApplication.countDocuments({ 
      recruiterId, 
      status: 'accepted' 
    });
    const rejectedApplications = await JobApplication.countDocuments({ 
      recruiterId, 
      status: 'rejected' 
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications
      }
    });

  } catch (error) {
    console.error('Get recruiter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create a new job posting
// @route   POST /api/recruiters/jobs
// @access  Private (Recruiters only)
export const createJob = async (req, res) => {
  try {
    console.log('Create job request body:', req.body);
    console.log('Recruiter ID:', req.user.id);
    console.log('Recruiter info:', req.user);

    // Add companyName from recruiter profile if not provided
    const jobData = {
      ...req.body,
      recruiterId: req.user.id,
      companyName: req.body.companyName || req.user.companyName
    };

    console.log('Job data to save:', jobData);

    const job = new Job(jobData);
    await job.save();

    // Update recruiter's job postings array
    await Recruiter.findByIdAndUpdate(
      req.user.id,
      { $push: { jobPostings: job._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Get all jobs posted by recruiter
// @route   GET /api/recruiters/jobs
// @access  Private (Recruiters only)
export const getRecruiterJobs = async (req, res) => {
  try {
    const { limit = 50, page = 1, status, search } = req.query;
    const recruiterId = req.user.id;

    // Build query
    let query = { recruiterId };
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$text = { $search: search };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get applicant counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await JobApplication.countDocuments({ 
          jobId: job._id 
        });
        return {
          ...job.toObject(),
          applicantCount
        };
      })
    );

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs: jobsWithCounts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalJobs / parseInt(limit)),
        totalJobs
      }
    });

  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/recruiters/jobs/:jobId
// @access  Private (Recruiters only)
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    const job = await Job.findOne({ _id: jobId, recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a job posting
// @route   PUT /api/recruiters/jobs/:jobId
// @access  Private (Recruiters only)
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    const job = await Job.findOne({ _id: jobId, recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    Object.assign(job, req.body);
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/recruiters/jobs/:jobId
// @access  Private (Recruiters only)
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    const job = await Job.findOne({ _id: jobId, recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Delete associated applications
    await JobApplication.deleteMany({ jobId });

    // Remove from recruiter's job postings
    await Recruiter.findByIdAndUpdate(
      recruiterId,
      { $pull: { jobPostings: jobId } }
    );

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle job active status
// @route   PATCH /api/recruiters/jobs/:jobId/toggle-status
// @access  Private (Recruiters only)
export const toggleJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    const job = await Job.findOne({ _id: jobId, recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
      job
    });

  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/recruiters/jobs/:jobId/applications
// @access  Private (Recruiters only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, limit = 50, page = 1 } = req.query;
    const recruiterId = req.user.id;

    // Verify job belongs to recruiter
    const job = await Job.findOne({ _id: jobId, recruiterId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Build query
    let query = { jobId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate('applicantId', 'name email profileImage resume phone')
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalApplications = await JobApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalApplications / parseInt(limit)),
        totalApplications
      }
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update job application status
// @route   PATCH /api/recruiters/applications/:applicationId/status
// @access  Private (Recruiters only)
export const updateJobApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, rating } = req.body;
    const recruiterId = req.user.id;

    const application = await JobApplication.findOne({
      _id: applicationId,
      recruiterId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = recruiterId;
    
    if (notes !== undefined) application.notes = notes;
    if (rating !== undefined) application.rating = rating;

    await application.save();

    // Reset new applications count when reviewed
    if (status !== 'pending') {
      await Job.findByIdAndUpdate(application.jobId, {
        $set: { newApplications: 0 }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};