import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recruiterAuthService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

// Dashboard Components
import RecruiterOverview from '../components/recruiter/RecruiterOverview';
import JobManagement from '../components/recruiter/JobManagement';
import AddJob from '../components/recruiter/AddJob';
import EditJob from '../components/recruiter/EditJob';
import ViewApplications from '../components/recruiter/ViewApplications';
import RecruiterProfile from '../components/recruiter/RecruiterProfile';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterProfile();
  }, []);

  const fetchRecruiterProfile = async () => {
    try {
      const response = await recruiterAuthService.getProfile();
      setProfileData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActiveTab = () => {
    const path = location.pathname.split('/')[2];
    return path || 'overview';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Global Connect</h1>
              <span className="text-gray-500">|</span>
              <h2 className="text-lg text-gray-700">Recruiter Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {profileData?.name || user?.name}</span>
              {profileData?.profileImage && (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/recruiter-dashboard/overview')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    getActiveTab() === 'overview'
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/recruiter-dashboard/manage-jobs')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    getActiveTab() === 'manage-jobs'
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/recruiter-dashboard/add-job')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    getActiveTab() === 'add-job'
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Job
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/recruiter-dashboard/applications')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    getActiveTab() === 'applications'
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/recruiter-dashboard/profile')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    getActiveTab() === 'profile'
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/recruiter-dashboard/overview" replace />} />
            <Route path="/overview" element={<RecruiterOverview profileData={profileData} />} />
            <Route path="/manage-jobs" element={<JobManagement profileData={profileData} />} />
            <Route path="/add-job" element={<AddJob profileData={profileData} />} />
            <Route path="/jobs/:jobId/edit" element={<EditJob profileData={profileData} />} />
            <Route path="/applications" element={<ViewApplications profileData={profileData} />} />
            <Route path="/profile" element={<RecruiterProfile profileData={profileData} onUpdate={fetchRecruiterProfile} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;