const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

exports.create_product = async (req, res) => {
  try {
    const { title, description, materials, size, category, price } = req.body;
    const imageFiles = req.files;
    const imagePaths = imageFiles.map((file) => file.filename);

    const product = new Product({
      title,
      description,
      materials,
      size,
      category,
      price,
      images: imagePaths,
      createdBy: req.user.id,
      isApproved: false,
    });

    await product.save();

    res.json({
      success: true,
      message: "Product created successfully with multiple images.",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

exports.view_products = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true });

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.view_artisan_products = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });

    res.json({
      success: true,
      message: "Your products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your products",
      error: error.message,
    });
  }
};

exports.get_product = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product found",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

exports.update_product = async (req, res) => {
  try {
    const { title, description, materials, size, category, price } = req.body;
    const update_data = {
      title,
      description,
      materials,
      size,
      category,
      price,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update_data,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

exports.delete_product = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(__dirname, "../uploads", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
