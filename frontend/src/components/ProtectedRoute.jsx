// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on their actual role
      if (user.role === 'recruiter') {
        return <Navigate to="/recruiter-dashboard" replace />;
      } else {
        return <Navigate to="/user-dashboard" replace />;
      }
    }

    return children;
  } catch (error) {
    // If user data is corrupted, clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;