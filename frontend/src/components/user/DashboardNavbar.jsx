import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import logo from "../../assets/logo.jpg";

const DashboardNavbar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const { unreadMessageCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-blue-600 shadow-lg py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <h1
              className="cursor-pointer flex items-center space-x-2"
              onClick={() => setActiveTab('feed')}
            >
              <img
                src={logo}
                alt="Global Connect Logo"
                className="w-36 sm:w-44 h-auto object-contain"
              />
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {['feed', 'jobs', 'messages', 'network', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-lg text-medium font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-900 hover:text-white hover:bg-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'messages' && unreadMessageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-lg">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Side (Welcome + Logout) */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-medium text-gray-700">
              Welcome,{' '}
              <span className="text-indigo-900 text-xl font-medium">
                {user?.name}
              </span>
            </span>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-blue-800 focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="flex flex-col px-4 py-3 space-y-2">
            {['feed', 'jobs', 'messages', 'network', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMenuOpen(false);
                }}
                className={`relative text-left px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-900 hover:text-white hover:bg-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'messages' && unreadMessageCount > 0 && (
                  <span className="absolute top-2 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </span>
                )}
              </button>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              <span className="block text-gray-700 mb-2">
                Welcome,{' '}
                <span className="text-indigo-900 font-medium">
                  {user?.name}
                </span>
              </span>
              <button
                onClick={onLogout}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
