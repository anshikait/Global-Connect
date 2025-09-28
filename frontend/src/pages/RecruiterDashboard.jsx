import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recruiterAuthService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  DashboardNavbar,
  DashboardSidebar,
  OverviewTab,
  JobsManagementTab,
  ApplicationsTab,
  CandidatesTab,
  CompanyProfileTab
} from '../components/recruiter';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="flex h-screen">
        <DashboardSidebar 
          profileData={profileData} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab profileData={profileData} />}
            {activeTab === 'jobs' && <JobsManagementTab profileData={profileData} />}
            {activeTab === 'applications' && <ApplicationsTab profileData={profileData} />}
            {activeTab === 'candidates' && <CandidatesTab />}
            {activeTab === 'company' && <CompanyProfileTab profileData={profileData} onUpdate={fetchRecruiterProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};



export default RecruiterDashboard;