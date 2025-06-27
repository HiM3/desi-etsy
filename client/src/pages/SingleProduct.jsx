import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaArrowLeft, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/get_product/${id}`);
      
      if (response.data.success) {
        setProduct(response.data.data);
        // Fetch artisan details
        fetchArtisan(response.data.data.createdBy);
        // Fetch related products in the same category
        fetchRelatedProducts(response.data.data.category, response.data.data._id);
      } else {
        toast.error('Failed to fetch product details');
        navigate('/product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch product details');
      navigate('/product');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisan = async (artisanId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/artisans/getArtisanById/${artisanId}`);
      if (response.data.success) {
        setArtisan(response.data.data.artisan);
      }
    } catch (error) {
      console.error('Error fetching artisan details:', error);
    }
  };

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/view_products`);
      if (response.data.success) {
        // Filter products by category and exclude current product
        const filtered = response.data.data
          .filter(p => p.category === category && p._id !== currentProductId)
          .slice(0, 4); // Limit to 4 related products
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleAddToCart = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      const cartItem = {
        id: product._id,
        name: product.title,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
        creator: artisan ? artisan.username : 'Unknown Artisan'
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/product" 
          className="flex items-center text-[#d35400] hover:text-[#b34700] transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-[#d35400]">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/product" className="text-gray-600 hover:text-[#d35400]">
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-[#d35400]">{product.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-4">
              <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${product.images[currentImageIndex]}`}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft className="text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                          aria-label="Next image"
                        >
                          <FaChevronRight className="text-gray-800" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${currentImageIndex === index ? 'border-[#d35400]' : 'border-transparent'}`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(5.0)</span>
              </div>
              
              <p className="text-2xl font-bold text-[#d35400] mb-4">₹{product.price.toLocaleString()}</p>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-gray-800 capitalize">{product.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Materials</h3>
                  <p className="text-gray-800">{product.materials}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p className="text-gray-800">{product.size}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Artisan</h3>
                  <p className="text-gray-800">{artisan ? artisan.username : 'Unknown'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-16 text-center border-y border-gray-300 py-1 focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#d35400] hover:bg-[#b34700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d35400] transition-colors"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#2c3e50] hover:bg-[#1a252f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c3e50] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan Info */}
        {artisan && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About the Artisan</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {artisan.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{artisan.username}</h3>
                <p className="text-gray-600 mt-1">{artisan.email}</p>
                <p className="text-gray-600 mt-2">
                  Experienced artisan specializing in handcrafted {product.category} items.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                >
                  <Link to={`/product/${relatedProduct._id}`}>
                    <div className="h-48 overflow-hidden">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/${relatedProduct.images[0]}`}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{relatedProduct.title}</h3>
                      <p className="text-[#d35400] font-bold mt-2">₹{relatedProduct.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;