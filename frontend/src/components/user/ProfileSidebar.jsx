import React from 'react';

const ProfileSidebar = ({ profileData, setActiveTab }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {profileData?.profilePic ? (
              <img
                src={profileData.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{profileData?.name}</h3>
          <p className="text-sm text-gray-600">{profileData?.jobTitle || 'Job Seeker'}</p>
          <p className="text-sm text-gray-500">{profileData?.location || 'Location not set'}</p>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Profile Completeness</span>
            <span className="text-blue-600">
              {profileData?.isProfileComplete ? '100%' : '60%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-800 to-blue-900 h-2 rounded-full" 
              style={{ width: profileData?.isProfileComplete ? '100%' : '60%' }}
            ></div>
          </div>
          {!profileData?.isProfileComplete && (
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full text-sm text-blue-600 hover:text-blue-800"
            >
              Complete your profile
            </button>
          )}
        </div>

        {/* Resume Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Resume Status</span>
            {profileData?.resume ? (
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs">Uploaded</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs">Missing</span>
              </div>
            )}
          </div>
          {!profileData?.resume && (
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full text-xs bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700"
            >
              Upload Resume
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-medium">{profileData?.connections?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Applications</span>
              <span className="font-medium">{profileData?.applications?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saved Jobs</span>
              <span className="font-medium">{profileData?.savedJobs?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;