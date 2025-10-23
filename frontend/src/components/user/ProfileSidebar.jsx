import React, { useState, useEffect } from 'react';
import { userService, connectionService } from '../../services/socialService.js';

const ProfileSidebar = ({ profileData, setActiveTab }) => {
  const [dashboardStats, setDashboardStats] = useState({
    connectionsCount: 0,
    applicationsCount: 0,
    savedJobsCount: 0,
    profileCompleteness: 0,
    isProfileComplete: false,
    hasResume: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData) {
      loadDashboardStats();
    }
  }, [profileData]);

  // Refresh stats when user updates profile or makes connections
  useEffect(() => {
    const refreshStats = () => {
      if (profileData) {
        loadDashboardStats();
      }
    };

    // Listen for custom events to refresh stats
    window.addEventListener('refreshDashboardStats', refreshStats);
    
    return () => {
      window.removeEventListener('refreshDashboardStats', refreshStats);
    };
  }, [profileData]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, connectionStatsResponse] = await Promise.all([
        userService.getDashboardStats(),
        connectionService.getNetworkStats()
      ]);

      if (statsResponse.success) {
        setDashboardStats(prevStats => ({
          ...prevStats,
          ...statsResponse.data
        }));
      }

      if (connectionStatsResponse.success) {
        setDashboardStats(prevStats => ({
          ...prevStats,
          connectionsCount: connectionStatsResponse.data.connections || 0
        }));
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-50">
            
            {profileData?.profilePic ? (
              
              <img
                src={profileData.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <svg className="w-12 h-12 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {loading ? 'Loading...' : `${dashboardStats.profileCompleteness}%`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-800 via-blue-900 to-teal-700 h-2 rounded-full transition-all duration-300" 
              style={{ width: loading ? '0%' : `${dashboardStats.profileCompleteness}%` }}
            ></div>
          </div>
          {!loading && !dashboardStats.isProfileComplete && (
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Complete your profile
            </button>
          )}
        </div>

        {/* Resume Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Resume Status</span>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            ) : dashboardStats.hasResume ? (
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
          {!loading && !dashboardStats.hasResume && (
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full text-xs bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Resume
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                <span className="font-medium text-blue-600">{dashboardStats.connectionsCount}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Applications</span>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                <span className="font-medium text-green-600">{dashboardStats.applicationsCount}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saved Jobs</span>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                <span className="font-medium text-purple-600">{dashboardStats.savedJobsCount}</span>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          {!loading && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('network')}
                className="w-full text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center space-x-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Expand Network</span>
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className="w-full text-xs bg-gradient-to-r from-green-50 to-green-100 text-green-700 py-2 px-3 rounded-lg hover:from-green-100 hover:to-green-200 transition-all flex items-center justify-center space-x-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span>Find Jobs</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;