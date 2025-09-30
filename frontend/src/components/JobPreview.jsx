// src/components/JobPreview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const JobPreview = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jobsPerPage = 3;

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/public?page=${currentPage}&limit=${jobsPerPage}`);
      setJobs(response.data.jobs || []);
      setTotalPages(Math.ceil(response.data.total / jobsPerPage));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNow = (jobId) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'user') {
      // Redirect to user login if not authenticated as user
      navigate('/user/login');
      return;
    }
    
    // If authenticated, redirect to user dashboard jobs tab to apply
    navigate(`/user-dashboard?tab=jobs&apply=${jobId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section id="jobs" className="py-20 bg-white">
        <div className="container 2xl:px-20 mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Featured Job Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing career opportunities from top companies looking for talented professionals like you.
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="jobs" className="py-20 bg-white">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Featured Job Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies looking for talented professionals like you.
          </p>
        </div>

        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Job Header */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                        {job.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{job.companyName || job.recruiter?.companyName}</p>
                    <p className="text-gray-500 text-sm flex items-center">
                      📍 {job.location}
                    </p>
                  </div>

                  {/* Salary */}
                  <div className="mb-4">
                    <p className="text-gray-800 font-semibold">
                      {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.length > 0 ? (
                        job.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                          No skills specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Posted {formatDate(job.createdAt)}</span>
                    <span>{job.applicantCount || 0} applicants</span>
                  </div>

                  {/* Apply Button */}
                  <button 
                    onClick={() => handleApplyNow(job._id)}
                    className="w-full bg-gradient-to-r from-slate-800 to-blue-800 text-white py-3 rounded-lg font-medium hover:from-slate-900 hover:to-blue-900 transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-slate-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">Check back later for new job opportunities!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobPreview;