// src/pages/RecruiterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'recruiter') {
        navigate('/user-dashboard');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">
                Global Connect - Recruiter
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Post Jobs
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Candidates
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Applications
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Messages
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-teal-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h2>
              <p className="text-gray-600">
                Manage your job postings, review applications, and find the perfect candidates for your company.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Dashboard */}
            <div className="md:col-span-2 space-y-6">
              {/* Company Profile */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Company Profile
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-teal-700 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-gray-600">{user.email}</p>
                      {user.company && <p className="text-gray-500 text-sm mt-1">{user.company}</p>}
                      {user.bio && <p className="text-gray-500 text-sm mt-1">{user.bio}</p>}
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-slate-800 to-teal-700 text-white px-4 py-2 rounded-lg hover:from-slate-900 hover:to-teal-800 transition-all">
                    Edit Company Profile
                  </button>
                </div>
              </div>

              {/* Recent Job Postings */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Job Postings
                    </h3>
                    <button className="bg-gradient-to-r from-slate-800 to-teal-700 text-white px-4 py-2 rounded-lg hover:from-slate-900 hover:to-teal-800 transition-all text-sm">
                      + Post New Job
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-center">No job postings yet. Create your first job posting to attract talented candidates!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Applications
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-center">No applications received yet. Post jobs to start receiving applications!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💼</span>
                        <div>
                          <p className="font-medium text-gray-900">Post New Job</p>
                          <p className="text-sm text-gray-500">Create job listing</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">👥</span>
                        <div>
                          <p className="font-medium text-gray-900">Search Candidates</p>
                          <p className="text-sm text-gray-500">Find talent</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📊</span>
                        <div>
                          <p className="font-medium text-gray-900">Analytics</p>
                          <p className="text-sm text-gray-500">View insights</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recruiting Stats */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recruiting Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Jobs</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Applications</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interviews Scheduled</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hires This Month</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              <div className="bg-gradient-to-br from-slate-800 to-teal-700 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-white mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-slate-200 text-sm mb-4">
                    Get access to advanced recruiting tools and candidate insights.
                  </p>
                  <button className="bg-white text-slate-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;