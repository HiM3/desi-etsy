import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AddToCart = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

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
        creator: product.creator
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      updateCartCount();

      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart successfully!');

      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 sm:w-16 text-center py-2 border-x border-gray-300 focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 bg-[#FF6B6B] text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-[#FF5252] transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <FaShoppingCart className="text-base sm:text-lg" />
          Add to Cart
        </button>
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
        <span>Total: ${(product.price * quantity).toLocaleString()}</span>
        <span className="text-[#FF6B6B] font-medium">Free Shipping</span>
      </div>
    </div>
  );
};

export default AddToCart;
