import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAuthService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  DashboardNavbar,
  ProfileSidebar,
  FeedTab,
  JobsTab,
  MessagesTab,
  NetworkTab,
  ProfileTab
} from '../components/user';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get active tab from localStorage or default to 'feed'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('userDashboardTab') || 'feed';
  });
  
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userDashboardTab', activeTab);
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAuthService.getProfile();
      setProfileData(response.data.user);
      
      // Emit event to refresh dashboard stats
      window.dispatchEvent(new CustomEvent('refreshDashboardStats'));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear the saved tab on logout
    localStorage.removeItem('userDashboardTab');
    logout();
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleSwitchToMessages = (conversation) => {
    setActiveTab('messages');
    setSelectedConversation(conversation);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <DashboardNavbar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProfileSidebar 
            profileData={profileData} 
            setActiveTab={handleTabChange} 
          />

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && <FeedTab />}
            {activeTab === 'jobs' && <JobsTab profileData={profileData} onApplicationUpdate={() => window.dispatchEvent(new CustomEvent('refreshDashboardStats'))} />}
            {activeTab === 'messages' && <MessagesTab selectedConversation={selectedConversation} />}
            {activeTab === 'network' && <NetworkTab profileData={profileData} onSwitchToMessages={handleSwitchToMessages} onConnectionUpdate={() => window.dispatchEvent(new CustomEvent('refreshDashboardStats'))} />}
            {activeTab === 'profile' && <ProfileTab profileData={profileData} onUpdate={fetchUserProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};



export default UserDashboard;