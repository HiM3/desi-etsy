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
    // Load cart items from localStorage on component mount
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

      // Create cart item object
      const cartItem = {
        id: product._id,
        name: product.title,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
        creator: product.creator
      };

      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        existingCart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      // Update cart count and trigger real-time update
      updateCartCount();

      // Dispatch cart updated event
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart successfully!');

      // Call the onAddToCart callback if provided
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center py-2 border-x border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2 rounded-lg hover:bg-[#FF5252] transition-colors shadow-md hover:shadow-lg"
        >
          <FaShoppingCart className="text-lg" />
          Add to Cart
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Total: ${(product.price * quantity).toLocaleString()}</span>
        <span className="text-[#FF6B6B] font-medium">Free Shipping</span>
      </div>
    </div>
  );
};

export default AddToCart;
