import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateUserSession, ROLES } from '../utils/roleUtils';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  // Validate user session
  if (!validateUserSession(user)) {
    console.error('Invalid user session detected, logging out');
    // Clear invalid session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/auth" replace />;
  }

  // Route to appropriate dashboard based on user role
  if (user?.role === ROLES.USER) {
    return <UserDashboard />;
  } else if (user?.role === ROLES.RECRUITER) {
    return <RecruiterDashboard />;
  }

  // Fallback - shouldn't happen but just in case
  console.error('Unknown user role:', user?.role);
  return <Navigate to="/auth" replace />;
};

export default Dashboard;