import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

import { Building2, Users, TrendingUp, Plus, UtensilsCrossed, FileText, BarChart3 } from "lucide-react";
import Card from "../component/Card";
import Button from "../component/Button";
import Badge from "../component/Badge";
import Loading from "../component/Loading";
import { authService } from "../services/authService";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [franchises, setFranchises] = useState([]);
  const [stats, setStats] = useState({
    totalFranchises: 0,
    activeFranchises: 0,
    inactiveFranchises: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getProfile();
      const data = response.data.data; // Backend returns data nested in data.data

      setProfile(data.profile);
      
      // Extract franchises from the response - backend returns createdFranchises
      const franchiseList = data.createdFranchises || [];
      setFranchises(franchiseList);

      // Use stats from backend if available, otherwise calculate
      if (data.stats) {
        setStats({
          totalFranchises: data.stats.totalFranchises,
          activeFranchises: data.stats.activeFranchises,
          inactiveFranchises: data.stats.totalFranchises - data.stats.activeFranchises,
        });
      } else {
        // Fallback calculation
        const total = franchiseList.length;
        const active = franchiseList.filter(f => f.isActive).length;
        const inactive = total - active;

        setStats({
          totalFranchises: total,
          activeFranchises: active,
          inactiveFranchises: inactive,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const [toggleLoading, setToggleLoading] = useState({});

  const handleFranchiseClick = (franchiseId) => {
    navigate(`/franchise/${franchiseId}`);
  };

  const handleToggleFranchiseStatus = async (e, franchiseId) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      setToggleLoading((prev) => ({ ...prev, [franchiseId]: true }));
      await authService.toggleFranchiseStatus(franchiseId);
      
      // Refresh data
      await fetchProfileData();
    } catch (err) {
      console.error("Error toggling franchise status:", err);
      setError(err.response?.data?.message || "Failed to toggle franchise status");
    } finally {
      setToggleLoading((prev) => ({ ...prev, [franchiseId]: false }));
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Error Loading Dashboard</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <Button onClick={fetchProfileData}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name || "Super Admin"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your restaurant franchises and system operations
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-white border-l-4 border-[#FF6B35]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Franchises</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalFranchises}
                  </p>
                </div>
                <div className="p-3 bg-[#FF6B35] rounded-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Franchises</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.activeFranchises}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-gray-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Franchises</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.inactiveFranchises}
                  </p>
                </div>
                <div className="p-3 bg-gray-400 rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Button
            variant="primary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => navigate("/create-franchise")}
            className="w-full"
          >
            Create Franchise
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<UtensilsCrossed className="w-5 h-5" />}
            onClick={() => navigate("/food-management")}
            className="w-full"
          >
            Food Management
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => navigate("/bills")}
            className="w-full"
          >
            View All Bills
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<BarChart3 className="w-5 h-5" />}
            onClick={() => navigate("/analytics")}
            className="w-full"
          >
            System Analytics
          </Button>
        </motion.div>

        {/* Franchise List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title="All Franchises">
            {franchises.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No franchises created yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Click "Create Franchise" to add your first franchise
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {franchises.map((franchise, index) => (
                  <motion.div
                    key={franchise._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleFranchiseClick(franchise._id)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#FF6B35] transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {franchise.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Owner: {franchise.ownerName}
                        </p>
                      </div>
                      <Badge variant={franchise.isActive ? "active" : "inactive"}>
                        {franchise.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        {franchise.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        {franchise.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        {franchise.city}, {franchise.state}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Click to view details
                      </p>
                      <button
                        onClick={(e) => handleToggleFranchiseStatus(e, franchise.id)}
                        disabled={toggleLoading[franchise.id]}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          franchise.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } ${
                          toggleLoading[franchise.id]
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {toggleLoading[franchise.id]
                          ? "..."
                          : franchise.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
