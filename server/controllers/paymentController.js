const OrderService = require('../services/orderService');

let stripe;
try {
  const STRIPE_SECRET_KEY = 'sk_test_51RaGcjP7KH8leRNeTqAQUqxp2uiPsnNQhhYLHmMBFriZJbGhluFREsvTKqKqft2pe6oj2Jo4LlfdCZeaXDRiiCDy008XgrM3fJ';
  if (!STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
  } else {
    stripe = require('stripe')(STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Stripe:', error);
}

exports.createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      console.error('Stripe not initialized');
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please check your STRIPE_SECRET_KEY',
      });
    }

    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount provided',
      });
    }

    console.log('Creating payment intent for amount:', amount);

    if (orderId) {
      const order = await OrderService.getOrderDetails(orderId, req.user._id);
      if (order.paymentStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Order is not in pending state',
        });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: orderId || 'pending',
        userId: req.user._id.toString(),
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment intent',
    });
  }
};

exports.handlePaymentStatus = async (req, res) => {
  try {
   
    const { orderId, paymentIntentId, status, error } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment Intent ID are required',
      });
    }

    if (status === 'paid') {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment has not been completed',
        });
      }
    }

    const order = await OrderService.updatePaymentStatus(orderId, status, {
      paymentIntentId,
      status,
      [status === 'paid' ? 'paidAt' : 'failedAt']: new Date(),
      ...(error && { error }),
    });

    res.json({
      success: true,
      message: `Payment ${status} successfully`,
      order: {
        id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderDetails(orderId, req.user._id);

    // Check Stripe status if payment is pending
    if (order.paymentStatus === 'pending' && order.paymentDetails?.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.paymentDetails.paymentIntentId
      );
      
      if (paymentIntent.status === 'succeeded') {
        await OrderService.updatePaymentStatus(orderId, 'paid', {
          status: 'succeeded',
          paidAt: new Date(),
        });
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
      }
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      paymentDetails: order.paymentDetails,
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};