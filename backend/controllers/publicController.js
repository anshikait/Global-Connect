import Job from '../models/Job.js';

// @desc    Get public jobs for homepage
// @route   GET /api/jobs/public
// @access  Public
export const getPublicJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 3, 
      search, 
      location 
    } = req.query;

    // Build query for active jobs only
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('recruiterId', 'companyName profileImage location email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('title description location salary skills jobType createdAt applicantCount isActive recruiterId');

    const total = await Job.countDocuments(query);

    // Transform jobs for public display
    const transformedJobs = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      skills: job.skills,
      jobType: job.jobType,
      createdAt: job.createdAt,
      applicantCount: job.applicantCount || 0,
      companyName: job.recruiterId?.companyName || 'Company Name Not Available',
      recruiter: {
        companyName: job.recruiterId?.companyName || 'Company Name Not Available',
        location: job.recruiterId?.location,
        profileImage: job.recruiterId?.profileImage
      }
    }));

    res.status(200).json({
      success: true,
      jobs: transformedJobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};