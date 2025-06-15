const express = require("express");
const {
  getAllApprovedArtisans,
  getArtisanById,
  getArtisanDashboard,
} = require("../controllers/artisanController");
const { verifyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.get("/showcase", getAllApprovedArtisans);

router.get("/dashboard", verifyuser, requireRole("artisan"), getArtisanDashboard);

router.get("/getArtisanById/:id", getArtisanById);

module.exports = router;
