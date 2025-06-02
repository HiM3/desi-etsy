const Product = require("../models/Product");

exports.create_product = async (req, res) => {
  try {
    const { title, description, materials, size, category, price } = req.body;
    const imageFiles = req.files;
    const imagePaths = imageFiles.map(file => file.filename);

    const product = new Product({
      title,
      description,
      materials,
      size,
      category,
      price,
      images: imagePaths,
      createdBy: req.user.id,
      isApproved: false
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
