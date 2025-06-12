import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/get_product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        reset(response.data.data);
        setImages(response.data.data.images || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch product details');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch product details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalImages = images.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Append all images
      images.forEach(image => {
        formData.append('images', image);
      });

      let response;
      if (id) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/products/update_product/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/products/create_product`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data.success) {
        toast.success(id ? 'Product updated successfully' : 'Product created successfully');
        navigate('/view-artisan-products');
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#d35400]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? 'Edit Product' : 'Create New Product'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters long'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Title cannot exceed 100 characters'
                    }
                  })}
                  className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                  placeholder="Enter product title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('price', {
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Price cannot be negative'
                    }
                  })}
                  className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters long'
                  },
                  maxLength: {
                    value: 2000,
                    message: 'Description cannot exceed 2000 characters'
                  }
                })}
                className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register('category', {
                    required: 'Category is required'
                  })}
                  className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                >
                  <option value="">Select Category</option>
                  <option value="handicrafts">Handicrafts</option>
                  <option value="textiles">Textiles</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="home-decor">Home Decor</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  {...register('size', {
                    required: 'Size is required'
                  })}
                  className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.size ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                  placeholder="Enter product size"
                />
                {errors.size && (
                  <p className="mt-1 text-sm text-red-500">{errors.size.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials Used
              </label>
              <input
                type="text"
                {...register('materials', {
                  required: 'Materials used is required'
                })}
                className={`w-full bg-white px-4 py-2 rounded-lg border ${errors.materials ? 'border-red-500' : 'border-gray-300'} focus:ring-[#d35400] focus:border-[#d35400]`}
                placeholder="Enter materials used"
              />
              {errors.materials && (
                <p className="mt-1 text-sm text-red-500">{errors.materials.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images ({images.length}/5)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#d35400] hover:text-[#b34700] focus-within:outline-none">
                      <span>Upload images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={uploading || images.length >= 5}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Upload up to 5 product images</p>
                </div>
              </div>
              {uploading && (
                <div className="mt-4 text-center">
                  <FaSpinner className="animate-spin text-[#d35400] mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
                </div>
              )}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Product ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/view-artisan-products')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="px-6 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#b34700] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
                {id ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProduct;