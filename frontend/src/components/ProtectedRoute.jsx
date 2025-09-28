import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated - redirect to auth selection
  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role requirement if specified
  if (requiredRole && user?.role !== requiredRole) {
    // Show unauthorized message and redirect to appropriate dashboard
    console.warn(`Access denied: User role '${user?.role}' attempted to access '${requiredRole}' only area`);
    
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = user?.role === 'recruiter' ? '/recruiter-dashboard' : '/user-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed - render the protected component
  return children;
};

export default ProtectedRoute;