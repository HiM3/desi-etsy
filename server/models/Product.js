const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materials: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // Artisan
    isApproved: { type: Boolean, default: false }, // Admin approval
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
