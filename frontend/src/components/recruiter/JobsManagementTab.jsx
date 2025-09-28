import React, { useState } from 'react';

const JobsManagementTab = ({ profileData }) => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experienceLevel: 'mid-level'
  });

  const handleJobSubmit = (e) => {
    e.preventDefault();
    // Here you would call the API to create a new job
    console.log('Creating job:', jobFormData);
    setShowJobForm(false);
    setJobFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      salary: '',
      jobType: 'full-time',
      experienceLevel: 'mid-level'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
        <button
          onClick={() => setShowJobForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Post New Job</span>
        </button>
      </div>

      {/* Job Creation Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Post New Job</h3>
              <button
                onClick={() => setShowJobForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. Senior React Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  value={jobFormData.location}
                  onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. New York, NY or Remote"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    value={jobFormData.jobType}
                    onChange={(e) => setJobFormData({...jobFormData, jobType: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    value={jobFormData.experienceLevel}
                    onChange={(e) => setJobFormData({...jobFormData, experienceLevel: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior-level">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <input
                  type="text"
                  value={jobFormData.salary}
                  onChange={(e) => setJobFormData({...jobFormData, salary: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. $80,000 - $120,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  required
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="4"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Requirements</label>
                <textarea
                  required
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="4"
                  placeholder="List the required skills, experience, and qualifications..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Active Job Postings</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {profileData?.jobPostings?.length > 0 ? (
            profileData.jobPostings.map((job, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">Senior React Developer</h4>
                    <p className="text-gray-600">New York, NY • Full Time • $90k - $130k</p>
                    <p className="text-sm text-gray-500 mt-2">Posted 3 days ago • 24 applications</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">View Applications</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-4 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  <span className="text-gray-500">24 Applications</span>
                  <span className="text-gray-500">3 Shortlisted</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-500 mb-6">Get started by posting your first job opening.</p>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsManagementTab;