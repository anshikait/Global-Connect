import React from 'react';

const DashboardNavbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-green-600">Global Connect - Recruiter</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user?.companyName}</span>
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