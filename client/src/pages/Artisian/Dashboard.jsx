import React, { useState, useEffect, useCallback } from 'react';
import { FaBox, FaShoppingBag, FaDollarSign, FaStar, FaBell, FaPlus, FaSync } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const [artisanProfile, setArtisanProfile] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/artisans/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const { artisan, products, orders, stats: dashboardStats } = response.data.data;

        setArtisanProfile(artisan);
        setArtisanProducts(products);
        setRecentOrders(orders || []);
        setStats(dashboardStats || {
          totalOrders: orders?.length || 0,
          pendingOrders: orders?.filter(order => order.orderStatus === 'pending').length || 0,
          totalProducts: products?.length || 0,
          totalRevenue: orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0,
          averageRating: products?.reduce((sum, product) => sum + (product.rating || 0), 0) / (products?.length || 1) || 0
        });

        if (refreshing) {
          toast.success('Dashboard data refreshed successfully');
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Artisan Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back{artisanProfile?.username ? `, ${artisanProfile.username}` : ''}! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-[#d35400] text-[#d35400] rounded-lg hover:bg-[#d35400] hover:text-white transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/add-product"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#b34700] transition-colors duration-300 text-sm sm:text-base"
            >
              <FaPlus className="mr-2" />
              Add New Product
            </Link>
            <NavLink
              to="/view-artisan-products"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-[#d35400] text-[#d35400] rounded-lg hover:bg-[#d35400] hover:text-white transition-colors duration-300 text-sm sm:text-base"
            >
              View All Products
            </NavLink>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-500">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                <FaShoppingBag className="text-xl sm:text-2xl text-[#d35400]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-500">Pending Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.pendingOrders}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                <FaBell className="text-xl sm:text-2xl text-[#d35400]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-500">Total Products</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                <FaBox className="text-xl sm:text-2xl text-[#d35400]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-500">Total Revenue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                <FaDollarSign className="text-xl sm:text-2xl text-[#d35400]" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Orders</h2>
              <Link
                to="/orders"
                className="text-sm sm:text-base text-[#d35400] hover:text-[#b34700] transition-colors duration-300"
              >
                View All Orders
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm text-gray-500">
                      No recent orders to display.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">#{order._id.slice(-6)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{order.user?.username || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {order.items?.map(item => item.product?.title).join(', ') || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">${order.totalAmount?.toLocaleString() || 0}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${!order.orderStatus || order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                          }`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'processing')}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'shipped')}
                            className="text-xs sm:text-sm text-purple-600 hover:text-purple-800"
                          >
                            Ship
                          </button>
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'delivered')}
                            className="text-xs sm:text-sm text-green-600 hover:text-green-800"
                          >
                            Deliver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 