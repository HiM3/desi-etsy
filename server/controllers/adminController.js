const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getPendingArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan", isVerified: false });
    res.status(200).json({
      success: true,
      data: artisans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending artisans",
      error: err.message,
    });
  }
};

exports.approveArtisan = async (req, res) => {
  try {
    const { id } = req.params;
    const artisan = await User.findById(id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    if (artisan.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Artisan is already verified",
      });
    }

    await User.findByIdAndUpdate(id, { isVerified: true });
    res.status(200).json({
      success: true,
      message: "Artisan approved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to approve artisan",
      error: err.message,
    });
  }
};

exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false }).populate(
      "createdBy",
      "username email"
    );
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending products",
      error: err.message,
    });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Product is already approved",
      });
    }

    await Product.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({
      success: true,
      message: "Product approved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to approve product",
      error: err.message,
    });
  }
};

exports.rejectArtisan = async (req, res) => {
  try {
    const { id } = req.params;
    const artisan = await User.findById(id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Artisan rejected and deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to reject artisan",
      error: err.message,
    });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product rejected and deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to reject product",
      error: err.message,
    });
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalArtisans = await User.countDocuments({ role: "artisan" });
    const pendingArtisans = await User.countDocuments({
      role: "artisan",
      isVerified: false,
    });
    const approvedArtisans = await User.countDocuments({
      role: "artisan",
      isVerified: true,
    });

    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ isApproved: false });
    const approvedProducts = await Product.countDocuments({ isApproved: true });

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        users: totalUsers,
        artisans: {
          total: totalArtisans,
          approved: approvedArtisans,
          pending: pendingArtisans,
        },
        products: {
          total: totalProducts,
          approved: approvedProducts,
          pending: pendingProducts,
        },
        orders: totalOrders,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: err.message,
    });
  }
};
