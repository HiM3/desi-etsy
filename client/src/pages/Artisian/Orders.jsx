import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort, FaEye, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/artisan-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
        if (refreshing) {
          toast.success('Orders refreshed successfully');
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
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
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.totalAmount - a.totalAmount;
        case 'lowest':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all your orders</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-[#d35400] text-[#d35400] rounded-lg hover:bg-[#d35400] hover:text-white transition-colors duration-300 disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-[#d35400] focus:border-[#d35400]"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#d35400] focus:border-[#d35400]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#d35400] focus:border-[#d35400]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Products</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.user?.username || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.items?.map(item => item.product?.title).join(', ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">${order.totalAmount?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#d35400] focus:border-[#d35400] p-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetails(true);
                            }}
                            className="p-2 text-gray-600 hover:text-[#d35400] transition-colors duration-200"
                          >
                            <FaEye />
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

        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Order Information</h3>
                  <p className="text-sm text-gray-600">Order ID: #{selectedOrder._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Status: {selectedOrder.orderStatus}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Customer Information</h3>
                  <p className="text-sm text-gray-600">Name: {selectedOrder.user?.username}</p>
                  <p className="text-sm text-gray-600">Email: {selectedOrder.user?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Products</h3>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-sm text-gray-800">{item.product?.title}</p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-800">${item.product?.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount</span>
                    <span className="font-bold text-gray-800">${selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;