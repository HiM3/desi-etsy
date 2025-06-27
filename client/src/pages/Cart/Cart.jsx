import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity, };
      }
      window.location.reload()
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));

    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Your Cart is Empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Add some products to your cart to see them here!</p>
            <button
              onClick={() => navigate('/product')}
              className="bg-[#FF6B6B] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#FF5252] transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f3] px-2 xs:px-4 sm:px-6 lg:px-8 pb-4 xs:pb-6 sm:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 border-b last:border-b-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL}/uploads/${item.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">Crafted by {item.creator}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-[#FF6B6B]"
                          >
                            <FaMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-[#FF6B6B]"
                          >
                            <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-base sm:text-lg font-semibold text-[#FF6B6B]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 sm:p-2 text-gray-600 hover:text-red-500"
                          >
                            <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Shipping</span>
                  <span className="text-[#FF6B6B]">Free</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#FF6B6B]">${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#FF6B6B] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#FF5252] transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;