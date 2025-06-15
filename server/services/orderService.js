const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  static calculateOrderTotals(items, shippingCost = 0, taxRate = 0.18) {
    try {
      const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const taxAmount = subtotal * taxRate;
      const finalAmount = subtotal + shippingCost + taxAmount;

      return {
        totalAmount: subtotal,
        shippingCost,
        taxAmount,
        finalAmount,
      };
    } catch (error) {
      throw new Error(`Error calculating order totals: ${error.message}`);
    }
  }

  static async validateOrderItems(items) {
    try {
      const validationResults = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            return {
              valid: false,
              error: `Product ${item.product} not found`,
            };
          }
          if (product.stock < item.quantity) {
            return {
              valid: false,
              error: `Insufficient stock for ${product.name}`,
            };
          }
          return { valid: true, product };
        })
      );

      const errors = validationResults
        .filter((result) => !result.valid)
        .map((result) => result.error);

      return {
        isValid: errors.length === 0,
        errors,
        products: validationResults
          .filter((result) => result.valid)
          .map((result) => result.product),
      };
    } catch (error) {
      throw new Error(`Error validating order items: ${error.message}`);
    }
  }

  static async createOrder(orderData) {
    try {
      const { items, paymentMethod, user, shippingAddress } = orderData;

      const validation = await this.validateOrderItems(items);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const totals = this.calculateOrderTotals(items);

      const order = new Order({
        user,
        items,
        ...(shippingAddress && { shippingAddress }),
        paymentMethod,
        ...totals,
      });

      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  static async updateOrderStatus(orderId, status, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) {
        throw new Error('Order not found');
      }

      const validTransitions = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: [],
      };

      if (!validTransitions[order.orderStatus].includes(status)) {
        throw new Error(`Invalid status transition from ${order.orderStatus} to ${status}`);
      }

      order.orderStatus = status;
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  static async updatePaymentStatus(orderId, paymentStatus, paymentDetails) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const validTransitions = {
        pending: ['paid', 'failed'],
        paid: ['refunded'],
        failed: ['pending'],
        refunded: [],
      };

      if (!validTransitions[order.paymentStatus].includes(paymentStatus)) {
        throw new Error(`Invalid payment status transition from ${order.paymentStatus} to ${paymentStatus}`);
      }

      order.paymentStatus = paymentStatus;
      order.paymentDetails = {
        ...order.paymentDetails,
        ...paymentDetails,
      };

      if (paymentStatus === 'paid') {
        await this.updateProductStock(order.items);
        order.orderStatus = 'processing';
      }

      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  static async updateProductStock(items) {
    try {
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    } catch (error) {
      throw new Error(`Error updating product stock: ${error.message}`);
    }
  }

  static async canCancelOrder(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) {
        throw new Error('Order not found');
      }

      return order.orderStatus === 'pending' && order.paymentStatus === 'pending';
    } catch (error) {
      throw new Error(`Error checking order cancellation: ${error.message}`);
    }
  }

  static async canRefundOrder(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) {
        throw new Error('Order not found');
      }

      const orderAge = Math.floor(
        (Date.now() - order.createdAt) / (1000 * 60 * 60 * 24)
      );

      return (
        order.paymentStatus === 'paid' &&
        ['processing', 'shipped'].includes(order.orderStatus) &&
        orderAge <= 7
      );
    } catch (error) {
      throw new Error(`Error checking order refund: ${error.message}`);
    }
  }

  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name images price');

      const total = await Order.countDocuments({ user: userId });

      return {
        orders,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching user orders: ${error.message}`);
    }
  }

  static async getOrderDetails(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('items.product', 'name images price')
        .populate('user', 'name email');

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error(`Error fetching order details: ${error.message}`);
    }
  }

  static async getOrderByPaymentIntent(paymentIntentId) {
    try {
      const order = await Order.findOne({
        'paymentDetails.paymentIntentId': paymentIntentId,
      });

      if (!order) {
        throw new Error('Order not found for payment intent');
      }

      return order;
    } catch (error) {
      throw new Error(`Error fetching order by payment intent: ${error.message}`);
    }
  }
}

module.exports = OrderService; 