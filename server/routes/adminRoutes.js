const express = require("express");
const { verfiyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const {
  getPendingArtisans,
  approveArtisan,
  getPendingProducts,
  approveProduct,
  rejectArtisan,
  rejectProduct,
  dashboardStats,
} = require("../controllers/adminController");
const router = express.Router();

router.get(
  "/dashboard-stats",
  verfiyuser,
  requireRole("admin"),
  dashboardStats
);
// All routes protected by 'admin' role
router.get(
  "/pending-artisans",
  verfiyuser,
  requireRole("admin"),
  getPendingArtisans
);
router.put(
  "/approve-artisan/:id",
  verfiyuser,
  requireRole("admin"),
  approveArtisan
);

router.get(
  "/pending-products",
  verfiyuser,
  requireRole("admin"),
  getPendingProducts
);
router.put(
  "/approve-product/:id",
  verfiyuser,
  requireRole("admin"),
  approveProduct
);

router.put(
  "/reject-artisan/:id",
  verfiyuser,
  requireRole("admin"),
  rejectArtisan
);
router.put(
  "/reject-product/:id",
  verfiyuser,
  requireRole("admin"),
  rejectProduct
);

module.exports = router;
