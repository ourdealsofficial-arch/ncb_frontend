import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, TrendingUp, FileText, UtensilsCrossed } from "lucide-react";
import Card from "../component/Card";
import Button from "../component/Button";
import Badge from "../component/Badge";
import Loading from "../component/Loading";
import { authService } from "../services/authService";
import { billService } from "../services/billService";

const FranchiseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [franchise, setFranchise] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);

  const fetchFranchiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch detailed franchise data from new endpoint
      const response = await authService.getFranchiseDetails(id);
      const data = response.data.data;
      
      if (!data.franchise) {
        setError("Franchise not found");
      } else {
        setFranchise(data.franchise);
        // Set analytics from franchise stats
        if (data.stats) {
          setAnalytics({
            totalOrders: data.stats.totalBills || 0,
            totalRevenue: data.stats.totalRevenue || 0,
            averageOrderValue: data.stats.totalBills > 0 
              ? (data.stats.totalRevenue / data.stats.totalBills) 
              : 0,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching franchise:", err);
      setError(err.response?.data?.message || "Failed to load franchise data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBills = async () => {
    try {
      // Fetch bills for this specific franchise
      const response = await billService.getFranchiseBills(id);
      setBills(response.data.data || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  // Fetch franchise data on mount
  useEffect(() => {
    fetchFranchiseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "bills" && franchise) {
      fetchBills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, franchise]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error || !franchise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Error</p>
            <p className="text-sm text-gray-600 mt-2">{error || "Franchise not found"}</p>
          </div>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Franchise Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FF6B35] rounded-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {franchise.businessName}
                    </h1>
                    <Badge variant={franchise.isActive ? "active" : "inactive"}>
                      {franchise.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">Owner: {franchise.ownerName}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-[#FF6B35]" />
                      <span>{franchise.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-[#FF6B35]" />
                      <span>{franchise.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-[#FF6B35]" />
                      <span>{franchise.address}, {franchise.city}, {franchise.state} - {franchise.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-[#FF6B35]" />
                      <span>Created: {new Date(franchise.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "dashboard"
                    ? "border-[#FF6B35] text-[#FF6B35]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab("bills")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "bills"
                    ? "border-[#FF6B35] text-[#FF6B35]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bills
                </div>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {analytics ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-orange-50 to-white">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {analytics.totalOrders || 0}
                        </p>
                      </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-white">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{analytics.totalRevenue?.toLocaleString() || 0}
                        </p>
                      </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-white">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Avg Order Value</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{analytics.averageOrderValue?.toFixed(2) || 0}
                        </p>
                      </div>
                    </Card>
                  </div>
                  <Card title="Analytics">
                    <p className="text-gray-600">
                      Detailed analytics for this franchise will be displayed here.
                    </p>
                  </Card>
                </>
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No analytics data available</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "bills" && (
            <Card title="Bills">
              {bills.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bill Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {bill.billNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {bill.customerDetails?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{bill.totalAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={bill.paymentMethod === "CASH" ? "warning" : "success"}>
                              {bill.paymentMethod}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(bill.paidAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No bills found for this franchise</p>
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FranchiseDetailsPage;
