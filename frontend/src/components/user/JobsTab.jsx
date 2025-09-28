import React from 'react';

const JobsTab = ({ profileData }) => (
  <div className="space-y-6">
    {/* Job Search */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Find Jobs</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search for jobs..."
          className="flex-1 p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Location"
          className="w-40 p-3 border rounded-lg"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>

    {/* My Applications */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">My Applications</h3>
      {profileData?.applications?.length > 0 ? (
        <div className="space-y-4">
          {profileData.applications.map((app, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Software Engineer</h4>
                  <p className="text-gray-600">Tech Company Inc.</p>
                  <p className="text-sm text-gray-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No applications yet. Start applying to jobs!</p>
      )}
    </div>

    {/* Recommended Jobs */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {[
          { title: 'Frontend Developer', company: 'StartupCo', location: 'Remote', salary: '$70k - $90k' },
          { title: 'Full Stack Engineer', company: 'TechFirm', location: 'New York', salary: '$80k - $120k' },
          { title: 'React Developer', company: 'WebAgency', location: 'San Francisco', salary: '$75k - $100k' }
        ].map((job, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-blue-600">{job.title}</h4>
                <p className="text-gray-800">{job.company}</p>
                <p className="text-sm text-gray-600">{job.location} • {job.salary}</p>
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Save</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default JobsTab;