import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaShoppingCart, FaBolt, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home Decor' },
    { id: 'handicrafts', name: 'handicrafts' },
    { id: 'art', name: 'Art & Paintings' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/view_products`);
      if (response.data.success) {
        const productsWithCreator = await Promise.all(
          response.data.data.map(async (product) => {
            if (!product.createdBy || product.createdBy === "undefined") {
              return {
                ...product,
                creator: "Unknown Artisan"
              };
            }
            try {
              const creatorResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/artisans/getArtisanById/${product.createdBy}`
              );
              return {
                ...product,
                creator: creatorResponse.data.data.artisan?.username || "Unknown Artisan"
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

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
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
        quantity: 1,
        image: product.images[0],
        creator: product.creator
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Product added to cart successfully!');
      navigate('/cart');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  const handleBuyNow = (product) => {
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
        quantity: 1,
        image: product.images[0],
        creator: product.creator
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Product added to cart successfully!');
      navigate('/cart');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
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

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.materials.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Discover Handcrafted Treasures</h1>
        </div>

        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-[#FF6B6B] focus:border-[#FF6B6B] text-sm sm:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-[#FF6B6B] focus:border-[#FF6B6B] text-sm sm:text-base"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleViewProduct(product._id)}
            >
              <div className="relative h-48 sm:h-64 group">
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(product._id, product.images.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {product.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${currentImageIndex[product._id] === index
                            ? 'bg-white'
                            : 'bg-white/50'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {product.isApproved && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#FF6B6B] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    Verified
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-2 sm:mb-3">
                  <p className="text-xs sm:text-sm text-gray-600">Crafted by</p>
                  <Link
                    to={`/artisan/${product.createdBy}`}
                    className="font-medium text-gray-800 hover:text-[#FF6B6B] transition-colors text-sm sm:text-base"
                  >
                    {product.creator || 'Unknown Artisan'}
                  </Link>
                </div>
                <h2 
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-1 hover:text-[#FF6B6B] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(product._id);
                  }}
                >
                  {product.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Materials:</span>
                    <span>{product.materials}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Size:</span>
                    <span>{product.size}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">${product.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-[#FF6B6B] text-white py-2 sm:py-3 rounded-lg hover:bg-[#FF5252] transition-colors duration-300 text-xs sm:text-sm"
                  >
                    <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] py-2 sm:py-3 rounded-lg hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                  >
                    <FaBolt className="w-3 h-3 sm:w-4 sm:h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 text-base sm:text-xl">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;