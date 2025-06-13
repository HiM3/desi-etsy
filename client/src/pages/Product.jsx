import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaShoppingCart, FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/view_products`);
      if (response.data.success) {
        const productsWithCreator = await Promise.all(
          response.data.data.map(async (product) => {
            try {
              const creatorResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/artisans/getArtisanById/${product.createdBy}`
              );
              return {
                ...product,
                creator: creatorResponse.data.data.artisan.username
              };
            } catch (err) {
              console.error('Error fetching creator:', err);
              return {
                ...product,
                creator: 'Unknown Artisan'
              };
            }
          })
        );
        setProducts(productsWithCreator);
        const initialImageIndex = {};
        productsWithCreator.forEach(product => {
          initialImageIndex[product._id] = 0;
        });
        setCurrentImageIndex(initialImageIndex);
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      // Create cart item object
      const cartItem = {
        id: product._id,
        name: product.title,
        price: product.price,
        quantity: 1,
        image: product.images[0],
        creator: product.creator
      };

      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item if it doesn't exist
        existingCart.push(cartItem);
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Product added to cart successfully!');
      navigate('/cart');
      window.location.reload()
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  const handleBuyNow = (product) => {
    toast.info('Buy now functionality coming soon!');
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-[#FF6B6B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Discover Handcrafted Treasures</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 group">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${product.images[currentImageIndex[product._id]]}`}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(product._id, product.images.length);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(product._id, product.images.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {product.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            currentImageIndex[product._id] === index
                              ? 'bg-white'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {product.isApproved && (
                  <div className="absolute top-4 left-4 bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Crafted by</p>
                  <p className="font-medium text-gray-800">{product.creator}</p>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Materials:</span>
                    <span>{product.materials}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Size:</span>
                    <span>{product.size}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#FF6B6B]">${product.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B6B] text-white py-3 rounded-lg hover:bg-[#FF5252] transition-colors duration-300"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] py-3 rounded-lg hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300"
                  >
                    <FaBolt />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;