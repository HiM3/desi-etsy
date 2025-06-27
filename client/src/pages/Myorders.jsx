import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/cancelOrder/${orderId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item =>
          item.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] px-2 xs:px-4 sm:px-6 lg:px-8 pb-4 xs:pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-[#d35400] text-[#d35400] rounded-lg hover:bg-[#d35400] hover:text-white transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-[#d35400] focus:border-[#d35400] text-sm sm:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#d35400] focus:border-[#d35400] text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Products</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">#{order._id.slice(-6)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {order.items?.map(item => item.product?.title).join(', ') || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">${order.totalAmount?.toLocaleString() || 0}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-green-100 text-green-800'
                          }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetails(true);
                            }}
                            className="p-1.5 sm:p-2 text-gray-600 hover:text-[#d35400] transition-colors duration-200"
                          >
                            <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          {order.orderStatus === 'pending' && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          )}
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
            <div className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 text-sm sm:text-base">Order Information</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Order ID: #{selectedOrder._id.slice(-6)}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Status: {selectedOrder.orderStatus}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 text-sm sm:text-base">Shipping Address</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">{selectedOrder.shippingAddress?.street}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">{selectedOrder.shippingAddress?.country}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Phone: {selectedOrder.shippingAddress?.phone}</p>
                  {selectedOrder.shippingAddress?.notes && (
                    <p className="text-xs sm:text-sm text-gray-600">Notes: {selectedOrder.shippingAddress.notes}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 text-sm sm:text-base">Products</h3>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-800">{item.product?.title}</p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800">${item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-sm sm:text-base">Total Amount</span>
                    <span className="font-bold text-gray-800 text-sm sm:text-base">${selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
                {selectedOrder.orderStatus === 'pending' && (
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        handleCancelOrder(selectedOrder._id);
                        setShowOrderDetails(false);
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Myorders;