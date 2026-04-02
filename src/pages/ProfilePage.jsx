import { useEffect, useState } from "react";
import api from "../config/api";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { User, Mail, Phone, Shield, CheckCircle, XCircle, Calendar, Building2, TrendingUp } from "lucide-react";
import Card from "../component/Card";
import Badge from "../component/Badge";
import Loading from "../component/Loading";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setProfileData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Error Loading Profile</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const { profile, createdFranchises, stats } = profileData || {};

  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your account information</p>
        </motion.div>

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-[#FF6B35] to-orange-600 rounded-xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                  <Badge variant={profile?.role === "SUPER_ADMIN" ? "warning" : "info"}>
                    {profile?.role === "SUPER_ADMIN" ? "Super Admin" : "Franchise Admin"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium">{profile?.mobileNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Shield className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {profile?.isVerified ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                            <CheckCircle className="w-4 h-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-medium text-sm">
                            <XCircle className="w-4 h-4" /> Not Verified
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        {profile?.isActive ? (
                          <span className="text-green-600 font-medium text-sm">Active</span>
                        ) : (
                          <span className="text-red-500 font-medium text-sm">Inactive</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Section - Only for Super Admin */}
        {isSuperAdmin && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-white border-l-4 border-[#FF6B35]">
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Total Franchises</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFranchises || 0}</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Active Franchises</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeFranchises || 0}</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Inactive Franchises</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFranchises - stats.activeFranchises || 0}</p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Franchises Section - Only for Super Admin */}
        {isSuperAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="My Franchises">
              {createdFranchises && createdFranchises.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Business Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdFranchises.map((franchise) => (
                        <tr key={franchise.id} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{franchise.businessName}</td>
                          <td className="py-3 px-4 text-gray-700">{franchise.ownerName}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{franchise.email}</td>
                          <td className="py-3 px-4 text-gray-600">{franchise.phone}</td>
                          <td className="py-3 px-4 text-gray-600">{franchise.city}, {franchise.state}</td>
                          <td className="py-3 px-4">
                            <Badge variant={franchise.isActive ? "success" : "error"}>
                              {franchise.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {new Date(franchise.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No franchises created yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Create your first franchise to get started
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Franchise Info - For Franchise Admin */}
        {!isSuperAdmin && profile?.franchiseId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="My Franchise">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FF6B35] rounded-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {profile.franchiseId.businessName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <p><span className="font-medium">Owner:</span> {profile.franchiseId.ownerName}</p>
                    <p><span className="font-medium">Email:</span> {profile.franchiseId.email}</p>
                    <p><span className="font-medium">Phone:</span> {profile.franchiseId.phone}</p>
                    <p><span className="font-medium">Location:</span> {profile.franchiseId.city}, {profile.franchiseId.state}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
