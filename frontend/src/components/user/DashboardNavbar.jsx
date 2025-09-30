import React from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';

const DashboardNavbar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const { unreadMessageCount } = useNotifications();
  return (
    <nav className="bg-gradient-to-r from-slate-800 via-blue-900 to-teal-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors cursor-pointer">Global Connect</h1>
            <div className="ml-10 flex space-x-2">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'feed' 
                    ? 'bg-white text-slate-800 shadow-md' 
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'jobs' 
                    ? 'bg-white text-slate-800 shadow-md' 
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'messages' 
                    ? 'bg-white text-slate-800 shadow-md' 
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Messages
                {unreadMessageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-lg">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'network' 
                    ? 'bg-white text-slate-800 shadow-md' 
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-white text-slate-800 shadow-md' 
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-200">Welcome, <span className="text-cyan-300 font-medium">{user?.name}</span></span>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
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