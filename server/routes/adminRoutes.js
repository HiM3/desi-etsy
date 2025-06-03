const express = require("express");
const { verifyuser } = require("../middlewares/authMiddleware");
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
  verifyuser,
  requireRole("admin"),
  dashboardStats
);
// All routes protected by 'admin' role
router.get(
  "/pending-artisans",
  verifyuser,
  requireRole("admin"),
  getPendingArtisans
);
router.put(
  "/approve-artisan/:id",
  verifyuser,
  requireRole("admin"),
  approveArtisan
);

router.get(
  "/pending-products",
  verifyuser,
  requireRole("admin"),
  getPendingProducts
);
router.put(
  "/approve-product/:id",
  verifyuser,
  requireRole("admin"),
  approveProduct
);

router.put(
  "/reject-artisan/:id",
  verifyuser,
  requireRole("admin"),
  rejectArtisan
);
router.put(
  "/reject-product/:id",
  verifyuser,
  requireRole("admin"),
  rejectProduct
);

module.exports = router;
