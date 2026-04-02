import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./component/NavBar";
import Loading from "./component/Loading";

// Lazy load page components for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/LoginPage"));
const VerificationPage = lazy(() => import("./pages/Verification"));
const DashboardRouter = lazy(() => import("./pages/DashboardRouter"));
const FranchiseRegister = lazy(() => import("./pages/CreateFranchise"));
const FoodManagementPage = lazy(() => import("./pages/FoodManagementPage"));
const FoodAvailabilityPage = lazy(() => import("./pages/FoodAvailabilityPage"));
const BillManagementPage = lazy(() => import("./pages/BillManagementPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const FranchiseDetailsPage = lazy(() => import("./pages/FranchiseDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<Loading fullScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
          
          {/* Verification Route - Requires authentication but not verification */}
          <Route 
            path="/verify" 
            element={
              <ProtectedRoute requireVerification={false}>
                <VerificationPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard Route - Redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireVerification={true}>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Super Admin Only Routes */}
          <Route 
            path="/create-franchise" 
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN" requireVerification={true}>
                <FranchiseRegister />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/food-management" 
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN" requireVerification={true}>
                <FoodManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/franchise/:id" 
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN" requireVerification={true}>
                <FranchiseDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Franchise Admin Only Routes */}
          <Route 
            path="/food-availability" 
            element={
              <ProtectedRoute requiredRole="FRANCHISE_ADMIN" requireVerification={true}>
                <FoodAvailabilityPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Common Protected Routes (Both roles) */}
          <Route 
            path="/bills" 
            element={
              <ProtectedRoute requireVerification={true}>
                <BillManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute requireVerification={true}>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requireVerification={true}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
              {/* Catch all - redirect to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
