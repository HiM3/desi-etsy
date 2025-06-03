const User = require("../models/User");
const Product = require("../models/Product");

exports.getPendingArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan", isVerified: false });
    res.json({
      success: true,
      data: artisans,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.approveArtisan = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isVerified: true });
    res.json({
      success: true,
      message: "Artisan approved successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false }).populate(
      "createdBy",
      "username email"
    );
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { isApproved: true });
    res.json({
      success: true,
      message: "Product approved successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.rejectArtisan = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: You can delete or flag artisan as rejected
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Artisan rejected and deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: You can delete or flag product as rejected
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product rejected and deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    const totalOrders = await Order.countDocuments(); // assuming Order model exists

    res.json({
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
    res.status(500).json({ success: false, message: err.message });
  }
};
