import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [currentProductToDeleteId, setCurrentProductToDeleteId] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/view_artisan_products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setProduct(response.data.data);
        const initialIndexes = {};
        response.data.data.forEach(item => {
          initialIndexes[item._id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      } else {
        toast.error(response.data.message || 'Failed to fetch product details');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch product details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages
    }));
  };

  const prevImage = (productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + totalImages) % totalImages
    }));
  };

  const handleDelete = async () => {
    if (!currentProductToDeleteId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete_product/${currentProductToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Product deleted successfully');
        setShowDeleteConfirm(false);
        setCurrentProductToDeleteId(null);
        fetchProduct();
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  if (!product || product.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-[#d35400] mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </motion.button>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {product.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header with Actions */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{item.title}</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <Link
                    to={`/add-product/${item._id}`}
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#b34700] transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setCurrentProductToDeleteId(item._id);
                    }}
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    {item.images && item.images.length > 0 ? (
                      <div className="relative">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/${item.images[currentImageIndex[item._id]]}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {item.images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(item._id, item.images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                              <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => nextImage(item._id, item.images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                              <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                              {item.images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${currentImageIndex[item._id] === index ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        <p className="text-sm sm:text-base text-gray-500">No images available</p>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">${item.price}</h2>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${item.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {item.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Description</h3>
                        <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Category</h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800">{item.category}</p>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Size</h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800">{item.size}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Materials Used</h3>
                        <p className="text-sm sm:text-base text-gray-600">{item.materials}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Confirm Delete</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;