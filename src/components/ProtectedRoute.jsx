import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../component/Loading';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireVerification = true 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading fullScreen={true} />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check verification status if required
  if (requireVerification && (!user.isVerified || !user.isActive)) {
    return <Navigate to="/verify" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === 'SUPER_ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'FRANCHISE_ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    // Fallback to login if role is unknown
    return <Navigate to="/login" replace />;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
