import React from 'react';

const DashboardNavbar = ({ user, activeTab, setActiveTab, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">Global Connect</h1>
            <div className="ml-10 flex space-x-4">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'feed' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'jobs' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'network' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;