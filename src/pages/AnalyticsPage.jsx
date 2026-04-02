import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Utensils,
  TrendingDown,
} from "lucide-react";
import Card from '../component/Card';
import Button from '../component/Button';
import Loading from '../component/Loading';
import { analyticsService } from '../services/analyticsService';

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('today');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getAnalytics(period);
      
      console.log('Analytics Response:', response.data); // Debug log
      
      if (response.data && response.data.success) {
        // Backend returns analytics and trends at root level
        const analyticsData = {
          ...response.data.analytics,
          trends: response.data.trends || []
        };
        
        console.log('Setting analytics state:', {
          hasAnalytics: !!response.data.analytics,
          hasTrends: !!response.data.trends,
          trendsLength: response.data.trends?.length || 0,
          trendsData: response.data.trends
        });
        
        setAnalytics(analyticsData);
      } else {
        setError(response.data?.message || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const periodButtons = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: '7 Days' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Error Loading Analytics</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <Button onClick={fetchAnalytics}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
          
          {/* Period Selector Buttons */}
          <div className="flex flex-wrap gap-3">
            {periodButtons.map((btn) => (
              <Button
                key={btn.value}
                variant={period === btn.value ? 'primary' : 'secondary'}
                onClick={() => handlePeriodChange(btn.value)}
                className="min-w-[100px]"
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-orange-50 to-white border-l-4 border-[#FF6B35]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{analytics?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-[#FF6B35] rounded-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics?.totalOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          {/* Average Order Value */}
          <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{analytics?.averageOrderValue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment Methods and Order Types Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Payment Methods Breakdown */}
          <Card title="Payment Methods">
            <div className="space-y-4">
              {/* Cash */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Cash</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {analytics?.paymentMethods?.cash?.count || 0} orders
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{analytics?.paymentMethods?.cash?.revenue?.toLocaleString() || 0}
                </p>
              </div>

              {/* Online */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Online</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {analytics?.paymentMethods?.online?.count || 0} orders
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{analytics?.paymentMethods?.online?.revenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Order Types Breakdown */}
          <Card title="Order Types">
            <div className="space-y-4">
              {/* Dine-in */}
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-[#FF6B35]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-[#FF6B35]" />
                    <span className="font-semibold text-gray-900">Dine-in</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {analytics?.orderTypes?.dineIn?.count || 0} orders
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#FF6B35]">
                  ₹{analytics?.orderTypes?.dineIn?.revenue?.toLocaleString() || 0}
                </p>
              </div>

              {/* Takeaway */}
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Takeaway</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {analytics?.orderTypes?.takeaway?.count || 0} orders
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{analytics?.orderTypes?.takeaway?.revenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Popular Items and Revenue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Popular Items Table */}
          <Card title="Popular Items">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics?.popularItems && analytics.popularItems.length > 0 ? (
                    analytics.popularItems.map((item, index) => (
                      <tr key={index} className="hover:bg-orange-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#FF6B35] text-right">
                          ₹{item.revenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top Revenue Items Table */}
          <Card title="Top Revenue Items">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics?.popularItems && analytics.popularItems.length > 0 ? (
                    [...analytics.popularItems]
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-orange-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#FF6B35] text-right">
                            ₹{item.revenue?.toLocaleString()}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Revenue Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card title="Revenue Trends">
            {(() => {
              console.log('Rendering trends chart:', {
                hasAnalytics: !!analytics,
                hasTrends: !!analytics?.trends,
                trendsLength: analytics?.trends?.length || 0,
                trendsData: analytics?.trends,
                period
              });
              return null;
            })()}
            {analytics?.trends && analytics.trends.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {period === 'yearly' ? (
                    <BarChart data={analytics.trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value, name) => {
                          if (name === 'Revenue (₹)') {
                            return [`₹${value.toLocaleString()}`, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Bar dataKey="revenue" fill="#FF6B35" name="Revenue (₹)" />
                      <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
                    </BarChart>
                  ) : (
                    <LineChart data={analytics.trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => {
                          // Format date as MM/DD
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
                          // Format date in tooltip
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
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No trend data available
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
