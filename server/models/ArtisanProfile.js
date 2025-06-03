const mongoose = require("mongoose");

const artisanProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number, // in years
      required: true,
    },
    address: {
      village: String,
      district: String,
      state: String,
      pincode: String,
    },
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    profilePicture: {
      type: String, // stores the filename or URL
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin can later approve artisans
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ArtisanProfile", artisanProfileSchema);
