import Recruiter from '../models/Recruiter.js';
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
      companyName,
      companyDescription,
      companySize,
      industry,
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

    // Update fields if provided
    if (companyName) recruiter.companyName = companyName.trim();
    if (companyDescription !== undefined) recruiter.companyDescription = companyDescription.trim();
    if (companySize) recruiter.companySize = companySize;
    if (industry) recruiter.industry = industry.trim();
    if (website) recruiter.website = website.trim();
    if (headquarters) recruiter.headquarters = headquarters.trim();
    if (foundedYear) recruiter.foundedYear = foundedYear;

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

    // Update name field to match company name for consistency
    if (companyName) recruiter.name = companyName.trim();

    // Check if profile is complete
    recruiter.checkProfileComplete();

    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Recruiter profile updated successfully',
      data: { recruiter }
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
      const publicId = recruiter.profilePic.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(`company_logos/${publicId}`);
    }

    // Upload new logo to cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'company_logos',
      width: 300,
      height: 300,
      crop: 'fit'
    });

    // Update recruiter logo URL
    recruiter.profilePic = result.secure_url;
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully',
      data: {
        logoUrl: recruiter.profilePic
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
    
    const recruiter = await Recruiter.findById(req.user.id)
      .populate({
        path: 'applicationsReceived.applicantId',
        select: 'name email profilePic jobTitle location skills experience'
      })
      .populate({
        path: 'applicationsReceived.jobId',
        select: 'title company location'
      });

    let applications = recruiter.applicationsReceived;

    // Filter by status if provided
    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    // Sort by most recent first
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedApplications = applications.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        applications: paginatedApplications,
        totalApplications: applications.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(applications.length / limit)
      }
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

    if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const recruiter = await Recruiter.findById(req.user.id);
    const application = recruiter.applicationsReceived.id(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    await recruiter.save();

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