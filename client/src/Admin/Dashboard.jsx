import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
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
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleArtisanAction = async (artisanId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/${action}-artisan/${artisanId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Artisan ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} artisan`);
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/${action}-product/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} product`);
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto mt-20 py-8">
        {/* Admin Dashboard Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="w-24 h-1 bg-[#d35400] mt-2"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#d35400]">{stats?.users || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Artisans</h3>
            <p className="text-3xl font-bold text-[#d35400]">{stats?.artisans?.total || 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.artisans?.pending || 0} pending approval
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-[#d35400]">{stats?.products?.total || 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.products?.pending || 0} pending approval
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-[#d35400]">{stats?.orders || 0}</p>
          </motion.div>
        </div>

        {/* Pending Artisans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-24 after:h-1 after:bg-[#d35400]">
            Pending Artisan Approvals
          </h2>
          {pendingArtisans.length === 0 ? (
            <p className="text-gray-500">No pending artisan approvals</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingArtisans.map((artisan) => (
                    <tr key={artisan._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{artisan.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{artisan.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleArtisanAction(artisan._id, 'approve')}
                          className="bg-[#d35400] text-white px-4 py-2 rounded-xl hover:bg-[#b34700] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleArtisanAction(artisan._id, 'reject')}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pending Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-24 after:h-1 after:bg-[#d35400]">
            Pending Product Approvals
          </h2>
          {pendingProducts.length === 0 ? (
            <p className="text-gray-500">No pending product approvals</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.createdBy.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleProductAction(product._id, 'approve')}
                          className="bg-[#d35400] text-white px-4 py-2 rounded-xl hover:bg-[#b34700] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProductAction(product._id, 'reject')}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;