import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import FranchiseAdminDashboard from './FranchiseAdminDashboard';
import Loading from '../component/Loading';

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  // Show loading while checking user role
  if (loading) {
    return <Loading fullScreen={true} />;
  }

  // If no user, redirect to login (shouldn't happen due to ProtectedRoute)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  if (user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  } else if (user.role === 'FRANCHISE_ADMIN') {
    return <FranchiseAdminDashboard />;
  }

  // Fallback - unknown role, redirect to login
  return <Navigate to="/login" replace />;
};

export default DashboardRouter;
