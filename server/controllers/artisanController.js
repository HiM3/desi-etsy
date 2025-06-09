const ArtisanProfile = require("../models/ArtisanProfile");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getAllApprovedArtisans = async (req, res) => {
  try {
    const artisans = await ArtisanProfile.find({ isApproved: true }).populate({
      path: "user",
      select: "username email",
    });

    const artisanData = await Promise.all(
      artisans.map(async (artisan) => {
        const products = await Product.find({ user: artisan.user._id });
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
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

exports.getArtisanById = async (req, res) => {
  try {
    const artisan = await ArtisanProfile.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!artisan || !artisan.isApproved) {
      return res
        .status(404)
        .json({ success: false, message: "Artisan not found" });
    }
    const products = await Product.find({ user: artisan.user._id });
    res.json({ success: true, artisan, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
