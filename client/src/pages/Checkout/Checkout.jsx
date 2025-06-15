import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaCreditCard, FaPaypal, FaGooglePay, FaMoneyBillWave, FaStripe } from 'react-icons/fa';
import { SiRazorpay } from "react-icons/si";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardHolderName, setCardHolderName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    if (!cardHolderName.trim()) {
      setError('Please enter card holder name');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Creating payment intent for amount:', amount);
      
      const { data: { clientSecret } } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
        { amount },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Payment intent created, confirming payment...');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardHolderName,
            },
          },
        }
      );

      if (stripeError) {
        console.error('Stripe payment error:', stripeError);
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err.response?.data?.message || err.message || 'Error processing payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder Name
            </label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder="Name as it appears on card"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
              required
            />
          </div>

          {/* Card Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Details
            </label>
            <div className="p-4 border rounded-lg bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      iconColor: '#d35400',
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          {/* Payment Amount */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-xl font-semibold text-[#d35400]">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="px-6 py-2 bg-[#d35400] text-white rounded-lg disabled:opacity-50 hover:bg-[#b34700] transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 0;
  const tax = 0.18;
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [shippingData, setShippingData] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Cart items from localStorage:', cart);
    setCartItems(cart);
    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    console.log('Calculated subtotal:', total);
    setSubtotal(total);
  }, []);

  const total = subtotal + shippingCost + (subtotal * tax);


  const handleStripeSuccess = async (paymentIntent) => {
    if (!shippingData) {
      toast.error('Shipping information is missing');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Creating order with payment intent:', paymentIntent.id);

      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price)
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          country: shippingData.country,
          zipCode: shippingData.zipCode,
          phone: shippingData.phone,
          notes: shippingData.notes
        },
        paymentMethod: 'stripe',
        totalAmount: total,
        paymentDetails: {
          paymentIntentId: paymentIntent.id,
          status: 'succeeded',
          paidAt: new Date().toISOString(),
          amount: total,
          currency: 'usd'
        }
      };

      console.log('Sending order data to backend:', orderData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/createOrder`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Order created successfully:', response.data);

      if (response.data.success) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        
        toast.success('Payment successful! Order placed.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Error processing payment');
    } finally {
      setIsProcessing(false);
      setShowStripeForm(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setShippingData(data);

    if (selectedPayment === 'stripe') {
      setShowStripeForm(true);
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Creating order with shipping data:', data);

      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price)
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          phone: data.phone,
          notes: data.notes
        },
        paymentMethod: selectedPayment,
        totalAmount: total
      };

      console.log('Sending order data to backend:', orderData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/createOrder`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Order created successfully:', response.data);

      if (response.data.success) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Order placed successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Address</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  {...register('street', { required: 'Address is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  placeholder="Add any special instructions or notes for your order..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white min-h-[100px] resize-none"
                />
              </div>

              {/* Terms and Conditions */}
              {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Standard delivery time: 3-5 business days</li>
                  <li>Free shipping on orders above $50</li>
                  <li>Express shipping available at checkout</li>
                  <li>International shipping available to select countries</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Terms & Conditions</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>All prices include applicable taxes</li>
                  <li>Orders are processed within 24 hours</li>
                  <li>Returns accepted within 14 days of delivery</li>
                  <li>Items must be in original condition for returns</li>
                </ul> */}

                {/* <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms and conditions' })}
                      className="rounded border-gray-300 text-[#d35400] focus:ring-[#d35400]"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the terms and conditions and shipping policy
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
                  )}
                </div> */}
              {/* </div> */}
            </form>
          </motion.div>

          {/* Right Side - Order Summary & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>${(subtotal * tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment('stripe')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                    selectedPayment === 'stripe' 
                      ? 'border-[#d35400] bg-[#d35400]/5' 
                      : 'border-gray-200 hover:border-[#d35400]'
                  }`}
                >
                  <FaStripe className="text-2xl" />
                  <span>Stripe</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment('paypal')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                    selectedPayment === 'paypal' 
                      ? 'border-[#d35400] bg-[#d35400]/5' 
                      : 'border-gray-200 hover:border-[#d35400]'
                  }`}
                >
                  <FaPaypal className="text-2xl" />
                  <span>PayPal</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment('razorpay')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                    selectedPayment === 'razorpay' 
                      ? 'border-[#d35400] bg-[#d35400]/5' 
                      : 'border-gray-200 hover:border-[#d35400]'
                  }`}
                >
                  <SiRazorpay className="text-2xl" />
                  <span>RazorPay</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                    selectedPayment === 'cod' 
                      ? 'border-[#d35400] bg-[#d35400]/5' 
                      : 'border-gray-200 hover:border-[#d35400]'
                  }`}
                >
                  <FaMoneyBillWave className="text-2xl" />
                  <span>Cash on Delivery</span>
                </motion.button>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing}
              className="w-full py-4 bg-[#d35400] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-[#d35400]/50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Stripe Payment Form Modal */}
      {showStripeForm && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            amount={total}
            onSuccess={handleStripeSuccess}
            onCancel={() => setShowStripeForm(false)}
          />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;