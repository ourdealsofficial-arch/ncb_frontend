import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, FileText, UtensilsCrossed, BarChart3 } from "lucide-react";
import Card from "../component/Card";
import Button from "../component/Button";
import Loading from "../component/Loading";
import Badge from "../component/Badge";
import { analyticsService } from "../services/analyticsService";
import { billService } from "../services/billService";
import { foodService } from "../services/foodService";

const FranchiseAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    popularItemsCount: 0,
    recentOrders: [],
  });
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState(null);
  const [foods, setFoods] = useState([]);
  const [toggleLoading, setToggleLoading] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchFoods();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard summary
      const dashboardResponse = await analyticsService.getDashboard("today");
      const dashboardData = dashboardResponse.data;

      // Fetch recent bills (last 10)
      const billsResponse = await billService.getAllBills({ limit: 10 });
      // Backend returns bills in data.data array
      const recentOrders = billsResponse.data.data || [];

      // Fetch 7 days trends for graph
      const analyticsResponse = await analyticsService.getAnalytics("7days");
      const trendsData = analyticsResponse.data.trends || [];

      setSummary({
        totalOrders: dashboardData.summary?.totalOrders || 0,
        totalRevenue: dashboardData.summary?.totalRevenue || 0,
        popularItemsCount: dashboardData.topSellingItems?.length || 0,
        recentOrders: recentOrders.slice(0, 10),
      });
      
      setTrends(trendsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await foodService.getAllFoods({ limit: 50 });
      setFoods(response.data.data?.foods || []);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  const handleToggleAvailability = async (foodId) => {
    try {
      setToggleLoading((prev) => ({ ...prev, [foodId]: true }));
      await foodService.toggleAvailability(foodId);
      
      // Update local state
      setFoods((prevFoods) =>
        prevFoods.map((food) =>
          food._id === foodId
            ? { ...food, isAvailable: !food.isAvailable }
            : food
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      alert(err.response?.data?.message || "Failed to update availability");
    } finally {
      setToggleLoading((prev) => ({ ...prev, [foodId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <Button onClick={fetchDashboardData}>Retry</Button>
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
            Franchise Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your restaurant operations and track today's performance
          </p>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-white border-l-4 border-[#FF6B35]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary.totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-[#FF6B35] rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
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
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(summary.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Popular Items</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary.popularItemsCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Button
            variant="primary"
            size="lg"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => navigate("/bills")}
            className="w-full"
          >
            Manage Bills
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<UtensilsCrossed className="w-5 h-5" />}
            onClick={() => navigate("/food-availability")}
            className="w-full"
          >
            Food Items
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<BarChart3 className="w-5 h-5" />}
            onClick={() => navigate("/analytics")}
            className="w-full"
          >
            Analytics
          </Button>
        </motion.div>

        {/* Revenue Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card title="Revenue Trends (Last 7 Days)">
            {trends && trends.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280" 
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        });
                      }}
                      formatter={(value, name) => {
                        if (name === 'Revenue (₹)') {
                          return [`₹${value.toLocaleString()}`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF6B35"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#FF6B35' }}
                      activeDot={{ r: 6 }}
                      name="Revenue (₹)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#3B82F6' }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No trend data available</p>
                  <p className="text-sm mt-2">Create some bills to see revenue trends</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card title="Recent Orders (Last 10)">
            {summary.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Orders will appear here once customers start placing them
                </p>
              </div>
            ) : (
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
                        Order Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.billNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.customerDetails?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderType === "DINE_IN" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {order.orderType === "DINE_IN" ? "Dine In" : "Takeaway"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.paymentMethod === "CASH" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-indigo-100 text-indigo-800"
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.paidAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Food Availability Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card title="Food Availability Management">
            <p className="text-gray-600 mb-4">Toggle food items availability for ordering</p>
            {foods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No food items found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {food.name}
                        </h4>
                        <p className="text-orange-600 font-medium text-sm">
                          ₹{food.price}
                        </p>
                      </div>
                      <Badge
                        variant={food.isAvailable ? "success" : "error"}
                        className="text-xs"
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-600 font-medium">
                        Availability
                      </span>
                      <button
                        onClick={() => handleToggleAvailability(food._id)}
                        disabled={toggleLoading[food._id]}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                          food.isAvailable
                            ? "bg-green-500"
                            : "bg-gray-300"
                        } ${
                          toggleLoading[food._id]
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-md"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            food.isAvailable ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FranchiseAdminDashboard;
