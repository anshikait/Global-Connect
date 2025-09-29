import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatSalary } from '../../utils/currencyUtils';

const JobsTab = ({ profileData }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [applying, setApplying] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const params = {
        limit: 20,
        page: 1,
        ...(searchTerm && { search: searchTerm }),
        ...(locationFilter && { location: locationFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(levelFilter !== 'all' && { level: levelFilter })
      };

      const response = await api.get('/users/jobs', { params });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const response = await api.get('/users/applications');
      setApplications(response.data.data?.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    // Check if user has uploaded resume
    if (!profileData?.resume) {
      alert('Please upload your resume before applying to jobs. Go to Profile tab to upload your resume.');
      return;
    }

    // Check if already applied
    const hasApplied = applications.some(app => app.jobId._id === jobId);
    if (hasApplied) {
      alert('You have already applied to this job.');
      return;
    }

    setApplying(jobId);
    try {
      const response = await api.post(`/users/apply/${jobId}`, {
        coverLetter: '' // Could add cover letter functionality later
      });
      
      console.log('Application successful:', response.data);
      alert('Application submitted successfully!');
      fetchUserApplications(); // Refresh applications
    } catch (error) {
      console.error('Error applying to job:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Error submitting application';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setApplying(null);
    }
  };

  const isJobApplied = (jobId) => {
    return applications.some(app => app.jobId._id === jobId);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
  };

  const JobCard = ({ job }) => (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm">{job.recruiterId?.companyName || 'Company'}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm font-medium">{formatSalary(job.salary, job.currency)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {job.type}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {job.level}
            </span>
            {job.isRemote && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Remote
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {job.description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
          </p>
          <div className="text-xs text-gray-500">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewDetails(job)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
        <div className="flex space-x-2">
          {isJobApplied(job._id) ? (
            <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-lg font-medium">
              Applied
            </span>
          ) : (
            <button
              onClick={() => handleApply(job._id)}
              disabled={applying === job._id}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying === job._id ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Job Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Find Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search for jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        <div className="mt-4">
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* My Applications Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">My Applications ({applications.length})</h3>
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-green-800">Accepted</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-800">Rejected</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No applications yet. Start applying to jobs below!</p>
        )}
      </div>

      {/* Resume Check */}
      {!profileData?.resume && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-amber-800">
              <strong>Resume Required:</strong> Please upload your resume in the Profile tab to apply for jobs.
            </p>
          </div>
        </div>
      )}

      {/* Available Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Available Jobs ({jobs.length})</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading jobs...</span>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2v2m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No jobs found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button
                onClick={closeJobModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-white">
                    {selectedJob.companyName?.charAt(0) || 'C'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJob.companyName || 'Company'}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedJob.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Posted {new Date(selectedJob.createdAt).toLocaleDateString()}
                    </div>
                    {selectedJob.deadline && (
                      <div className="flex items-center text-sm text-red-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Apply by {new Date(selectedJob.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedJob.type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {selectedJob.type}
                  </span>
                )}
                {selectedJob.level && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {selectedJob.level}
                  </span>
                )}
                {selectedJob.isRemote && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    Remote
                  </span>
                )}
                {selectedJob.salaryMin && selectedJob.salaryMax && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    💰 {formatSalary(selectedJob.salaryMin, selectedJob.currency)} - {formatSalary(selectedJob.salaryMax, selectedJob.currency)}
                  </span>
                )}
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Job Description
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedJob.description || '<p>Job description not provided.</p>' }}
                  />
                </div>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.trim() && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Requirements
                  </h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: selectedJob.requirements }}
                    />
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.trim() && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Benefits & Perks
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: selectedJob.benefits }}
                    />
                  </div>
                </div>
              )}

              {/* Skills Required */}
              {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsRequired.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Job Details</h4>
                  <div className="space-y-3 text-sm">
                    {selectedJob.type && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Employment Type:</span>
                        <span className="font-medium bg-blue-50 px-2 py-1 rounded">{selectedJob.type}</span>
                      </div>
                    )}
                    {selectedJob.level && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Experience Level:</span>
                        <span className="font-medium bg-green-50 px-2 py-1 rounded">{selectedJob.level}</span>
                      </div>
                    )}
                    {selectedJob.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedJob.department}</span>
                      </div>
                    )}
                    {selectedJob.workingHours && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Working Hours:</span>
                        <span className="font-medium">{selectedJob.workingHours}</span>
                      </div>
                    )}
                    {selectedJob.isRemote && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Work Style:</span>
                        <span className="font-medium bg-purple-50 px-2 py-1 rounded text-purple-700">Remote Available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Compensation & Benefits</h4>
                  <div className="space-y-3 text-sm">
                    {selectedJob.salaryMin && selectedJob.salaryMax ? (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">Salary Range:</span>
                          <span className="font-bold text-green-700">
                            {formatSalary(selectedJob.salaryMin, selectedJob.currency)} - {formatSalary(selectedJob.salaryMax, selectedJob.currency)}
                          </span>
                        </div>
                        {selectedJob.salaryType && (
                          <div className="text-xs text-gray-500 text-center">
                            Per {selectedJob.salaryType}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 text-center block">💼 Competitive salary package</span>
                      </div>
                    )}
                    
                    {selectedJob.currency && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{selectedJob.currency}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
              <button
                onClick={closeJobModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <div className="flex space-x-3">
                {isJobApplied(selectedJob._id) ? (
                  <span className="px-6 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      handleApply(selectedJob._id);
                      closeJobModal();
                    }}
                    disabled={applying === selectedJob._id}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {applying === selectedJob._id ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTab;