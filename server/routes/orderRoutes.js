const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController.js");
const { verifyuser } = require("../middlewares/authMiddleware.js");
const { requireRole } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// User routes
router.post("/", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:id", getOrder);
router.put("/:id/cancel", cancelOrder);

// Admin routes
router.get("/", verifyuser, requireRole("admin"), getAllOrders);
router.put("/:id/status", verifyuser, requireRole("admin"), updateOrderStatus);

module.exports = router;
