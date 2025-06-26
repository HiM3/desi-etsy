const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array",
      });
    }
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // Validate and build order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        if (!item.product || !item.quantity) {
          throw new Error("Each item must have a product ID and quantity");
        }
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (!product.isApproved) {
          throw new Error(`Product ${product.title} is not approved for sale`);
        }
        return {
          product: item.product,
          quantity: item.quantity,
          price: item.price || product.price,
        };
      })
    );

    const calculatedTotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const finalTotalAmount = totalAmount || calculatedTotal;

    let initialPaymentStatus = "pending";
    if (paymentMethod === "stripe" && paymentDetails?.status === "succeeded") {
      initialPaymentStatus = "paid";
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: finalTotalAmount,
      finalAmount: finalTotalAmount,
      shippingCost: 0,
      taxAmount: 0,
      orderStatus: "pending",
      paymentStatus: initialPaymentStatus,
      paymentDetails: paymentDetails || {},
    });
    await order.save();
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Only return orders for products created by the artisan
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "artisan") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view all orders",
      });
    }
    // Find all products by this artisan
    const artisanProducts = await Product.find({ createdBy: req.user._id }).select(
      "_id"
    );
    const productIds = artisanProducts.map((p) => p._id);
    // Find orders that contain any of these products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "username email")
      .populate("items.product", "title price images createdBy")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "title price images createdBy")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "User orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product", "title price images createdBy");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // Only allow the user or the artisan who owns any product in the order
    const isUser = order.user._id.toString() === req.user._id.toString();
    let isArtisan = false;
    if (req.user.role === "artisan") {
      isArtisan = order.items.some(
        (item) => item.product.createdBy?.toString() === req.user._id.toString()
      );
    }
    if (!isUser && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "artisan") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update order status",
      });
    }
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    if (
      orderStatus &&
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }
    if (
      paymentStatus &&
      !["pending", "paid", "failed", "refunded"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // Only allow the artisan who owns any product in the order
    const isArtisan = order.items.some(
      (item) => item.product.createdBy?.toString() === req.user._id.toString()
    );
    if (!isArtisan) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }
    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is not in pending status",
      });
    }
    order.orderStatus = "cancelled";
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};
