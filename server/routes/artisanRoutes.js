const express = require("express");
const {
  getAllApprovedArtisans,
  getArtisanById,
  getArtisanDashboard,
} = require("../controllers/artisanController");
const { verifyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const router = express.Router();

// Public: get all approved artisans with their products
router.get("/showcase", getAllApprovedArtisans);

// Artisan Dashboard - must be before /:id route
router.get("/dashboard", verifyuser, requireRole("artisan"), getArtisanDashboard);

// Optional: artisan profile detail
router.get("/:id", getArtisanById);

module.exports = router;
