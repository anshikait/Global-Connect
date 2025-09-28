import React from 'react';

const ApplicationsTab = ({ profileData }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
    </div>

    {/* Applications List */}
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Applications</h3>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Shortlisted</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {profileData?.applicationsReceived?.length > 0 ? (
          profileData.applicationsReceived.map((application, index) => (
            <div key={index} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">JD</span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">John Doe</h4>
                    <p className="text-gray-600">Applied for: Senior React Developer</p>
                    <p className="text-sm text-gray-500">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  
                  <div className="mt-3 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View Profile</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Shortlist</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                  </div>
                </div>
              </div>
              
              {application.coverLetter && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Cover Letter:</h5>
                  <p className="text-gray-700">{application.coverLetter}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500">Applications will appear here once candidates start applying to your jobs.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ApplicationsTab;