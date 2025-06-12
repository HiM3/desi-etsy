const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

exports.getAllApprovedArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan', isApproved: true })
      .select('username email')
      .lean();

    const artisanData = await Promise.all(
      artisans.map(async (artisan) => {
        const products = await Product.find({ createdBy: artisan._id })
          .select('title price images rating')
          .lean();
        return {
          artisan,
          products,
        };
      })
    );

    res.json({
      success: true,
      data: artisanData,
    });
  } catch (error) {
    console.error("Error fetching approved artisans:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch approved artisans",
      error: error.message 
    });
  }
};

exports.getArtisanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Artisan ID is required"
      });
    }

    const artisan = await User.findOne({ 
      _id: id,
      role: 'artisan'
    })
    .select('username email')
    .lean();

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found"
      });
    }

    if (!artisan.isApproved) {
      return res.status(403).json({
        success: false,
        message: "This artisan account is not approved yet"
      });
    }

    const products = await Product.find({ createdBy: artisan._id })
      .select('title price images rating description')
      .lean();

    res.json({
      success: true,
      data: {
        artisan,
        products
      }
    });
  } catch (error) {
    console.error("Error fetching artisan by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch artisan details",
      error: error.message
    });
  }
};

exports.getArtisanDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const artisan = await User.findOne({ 
      _id: userId,
      role: 'artisan'
    })
    .select('username email')
    .lean();

    // if (!artisan) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Artisan account not found"
    //   });
    // }

    // if (!artisan.isApproved) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your artisan account is not approved yet"
    //   });
    // }

    // Get products with optimized query
    const products = await Product.find({ createdBy: userId })
      .select('title price images rating description')
      .lean();

    // Get orders with optimized query
    const orders = await Order.find({
      'items.product': { $in: products.map(p => p._id) }
    })
    .populate('user', 'username email')
    .populate('items.product', 'title price images')
    .select('totalAmount status items createdAt')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalProducts: products.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      averageRating: products.length > 0 
        ? products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length 
        : 0
    };

    res.json({
      success: true,
      message: "Artisan dashboard data fetched successfully",
      data: {
        artisan,
        products,
        orders,
        stats
      }
    });
  } catch (error) {
    console.error("Error fetching artisan dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch artisan dashboard data",
      error: error.message
    });
  }
};
