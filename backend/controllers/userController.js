import User from '../models/User.js';
import cloudinary from 'cloudinary';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Users only)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connections', 'name email profilePic jobTitle location')
      .populate('jobApplications.jobId', 'title company location');

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Users only)
export const updateUserProfile = async (req, res) => {
  try {
    const {
      bio,
      jobTitle,
      experience,
      skills,
      education,
      certifications,
      projects
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic fields
    if (bio !== undefined) user.bio = bio.trim();
    if (jobTitle) user.jobTitle = jobTitle.trim();

    // Update experience
    if (experience && Array.isArray(experience)) {
      user.experience = experience.map(exp => ({
        jobTitle: exp.jobTitle?.trim(),
        company: exp.company?.trim(),
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current || false,
        description: exp.description?.trim()
      }));
    }

    // Update skills
    if (skills && Array.isArray(skills)) {
      user.skills = skills.map(skill => skill.trim()).filter(skill => skill);
    }

    // Update education
    if (education && Array.isArray(education)) {
      user.education = education.map(edu => ({
        degree: edu.degree?.trim(),
        school: edu.school?.trim(),
        graduationYear: edu.graduationYear,
        fieldOfStudy: edu.fieldOfStudy?.trim()
      }));
    }

    // Update certifications
    if (certifications && Array.isArray(certifications)) {
      user.certifications = certifications.map(cert => ({
        name: cert.name?.trim(),
        issuer: cert.issuer?.trim(),
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        credentialId: cert.credentialId?.trim()
      }));
    }

    // Update projects
    if (projects && Array.isArray(projects)) {
      user.projects = projects.map(project => ({
        name: project.name?.trim(),
        description: project.description?.trim(),
        technologies: Array.isArray(project.technologies) 
          ? project.technologies.map(tech => tech.trim()).filter(tech => tech)
          : [],
        url: project.url?.trim(),
        startDate: project.startDate,
        endDate: project.endDate
      }));
    }

    // Check if profile is complete
    user.checkProfileComplete();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-pic
// @access  Private (Users only)
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture from cloudinary if exists
    if (user.profilePic) {
      const publicId = user.profilePic.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(`profile_pics/${publicId}`);
    }

    // Upload new profile picture to cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'profile_pics',
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face'
    });

    // Update user profile picture URL
    user.profilePic = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/users/apply/:jobId
// @access  Private (Users only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const user = await User.findById(req.user.id);

    // Check if already applied
    const existingApplication = user.jobApplications.find(
      app => app.jobId.toString() === jobId
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Add job application
    user.jobApplications.push({
      jobId,
      appliedAt: new Date(),
      status: 'pending',
      coverLetter: coverLetter?.trim() || ''
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Job application submitted successfully'
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's job applications
// @route   GET /api/users/applications
// @access  Private (Users only)
export const getUserApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id)
      .populate({
        path: 'jobApplications.jobId',
        select: 'title company location salary requirements'
      });

    let applications = user.jobApplications;

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
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send connection request
// @route   POST /api/users/connect/:targetUserId
// @access  Private (Users only)
export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { message } = req.body;

    if (targetUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      });
    }

    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already connected
    if (user.connections.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Already connected with this user'
      });
    }

    // Check if request already sent
    const existingRequest = targetUser.connectionRequests.find(
      req => req.from.toString() === user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already sent'
      });
    }

    // Add connection request to target user
    targetUser.connectionRequests.push({
      from: user._id,
      message: message?.trim() || '',
      sentAt: new Date(),
      status: 'pending'
    });

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'Connection request sent successfully'
    });

  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Respond to connection request
// @route   PUT /api/users/connection-requests/:requestId
// @access  Private (Users only)
export const respondToConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "accept" or "reject"'
      });
    }

    const user = await User.findById(req.user.id);
    const connectionRequest = user.connectionRequests.id(requestId);

    if (!connectionRequest) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    if (action === 'accept') {
      // Add both users to each other's connections
      user.connections.push(connectionRequest.from);
      
      const requesterUser = await User.findById(connectionRequest.from);
      requesterUser.connections.push(user._id);
      await requesterUser.save();

      connectionRequest.status = 'accepted';
    } else {
      connectionRequest.status = 'rejected';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Connection request ${action}ed successfully`
    });

  } catch (error) {
    console.error('Respond to connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};