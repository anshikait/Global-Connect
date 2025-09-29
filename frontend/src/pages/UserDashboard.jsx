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
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAuthService.getProfile();
      setProfileData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardNavbar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProfileSidebar 
            profileData={profileData} 
            setActiveTab={setActiveTab} 
          />

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && <FeedTab />}
            {activeTab === 'jobs' && <JobsTab profileData={profileData} />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'network' && <NetworkTab profileData={profileData} />}
            {activeTab === 'profile' && <ProfileTab profileData={profileData} onUpdate={fetchUserProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};



export default UserDashboard;