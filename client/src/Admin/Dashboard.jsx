import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUsers, FaStore, FaShoppingBag, FaShoppingCart, FaSync } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    artisan: {},
    product: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const [statsRes, artisansRes, productsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/pending-artisans`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/pending-products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setPendingArtisans(artisansRes.data.data);
      setPendingProducts(productsRes.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleArtisanAction = async (artisanId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, artisan: { ...prev.artisan, [artisanId]: true } }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/${action}-artisan/${artisanId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Artisan ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${action} artisan`;
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, artisan: { ...prev.artisan, [artisanId]: false } }));
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, product: { ...prev.product, [productId]: true } }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/${action}-product/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${action} product`;
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, product: { ...prev.product, [productId]: false } }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-[#d35400] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-[#d35400] text-white px-6 py-2 rounded-xl hover:bg-[#b34700] transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] px-2 xs:px-4 sm:px-6 lg:px-8 pb-6 xs:pb-8">
      <div className="max-w-7xl mx-auto mt-8 xs:mt-12 sm:mt-20 py-2 xs:py-4 sm:py-8">
        <div className="mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="w-16 xs:w-20 sm:w-24 h-1 bg-[#d35400] mt-2"></div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Users</h3>
              <FaUsers className="text-[#d35400] text-xl sm:text-2xl" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#d35400]">{stats?.users || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Artisans</h3>
              <FaStore className="text-[#d35400] text-xl sm:text-2xl" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#d35400]">{stats?.artisans?.total || 0}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {stats?.artisans?.pending || 0} pending approval
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Products</h3>
              <FaShoppingBag className="text-[#d35400] text-xl sm:text-2xl" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#d35400]">{stats?.products?.total || 0}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {stats?.products?.pending || 0} pending approval
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Orders</h3>
              <FaShoppingCart className="text-[#d35400] text-xl sm:text-2xl" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#d35400]">{stats?.orders || 0}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-20 sm:after:w-24 after:h-1 after:bg-[#d35400]">
            Pending Artisan Approvals
          </h2>
          {pendingArtisans.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending artisan approvals</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">Username</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingArtisans.map((artisan) => (
                        <tr key={artisan._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{artisan.username}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{artisan.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                              <button
                                onClick={() => handleArtisanAction(artisan._id, 'approve')}
                                disabled={actionLoading.artisan[artisan._id]}
                                className="bg-[#d35400] text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:bg-[#b34700] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              >
                                {actionLoading.artisan[artisan._id] ? (
                                  <span className="flex items-center justify-center space-x-2">
                                    <FaSync className="animate-spin" />
                                    <span>Processing...</span>
                                  </span>
                                ) : (
                                  'Approve'
                                )}
                              </button>
                              <button
                                onClick={() => handleArtisanAction(artisan._id, 'reject')}
                                disabled={actionLoading.artisan[artisan._id]}
                                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              >
                                {actionLoading.artisan[artisan._id] ? (
                                  <span className="flex items-center justify-center space-x-2">
                                    <FaSync className="animate-spin" />
                                    <span>Processing...</span>
                                  </span>
                                ) : (
                                  'Reject'
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-20 sm:after:w-24 after:h-1 after:bg-[#d35400]">
            Pending Product Approvals
          </h2>
          {pendingProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending product approvals</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">Product Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{product.title}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                              <button
                                onClick={() => handleProductAction(product._id, 'approve')}
                                disabled={actionLoading.product[product._id]}
                                className="bg-[#d35400] text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:bg-[#b34700] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              >
                                {actionLoading.product[product._id] ? (
                                  <span className="flex items-center justify-center space-x-2">
                                    <FaSync className="animate-spin" />
                                    <span>Processing...</span>
                                  </span>
                                ) : (
                                  'Approve'
                                )}
                              </button>
                              <button
                                onClick={() => handleProductAction(product._id, 'reject')}
                                disabled={actionLoading.product[product._id]}
                                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              >
                                {actionLoading.product[product._id] ? (
                                  <span className="flex items-center justify-center space-x-2">
                                    <FaSync className="animate-spin" />
                                    <span>Processing...</span>
                                  </span>
                                ) : (
                                  'Reject'
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;