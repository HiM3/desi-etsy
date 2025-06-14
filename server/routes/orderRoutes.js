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
router.post("/createOrder", verifyuser, createOrder);
router.get("/my-orders", verifyuser, getUserOrders);
router.get("/getOrder/:id", verifyuser, getOrder);
router.put("/cancelOrder/:id/cancel", verifyuser, cancelOrder);

// Artisan routes
router.get("/artisan-orders", verifyuser, requireRole("artisan"), getAllOrders);
router.put("/:id/status", verifyuser, requireRole("artisan"), updateOrderStatus);

module.exports = router;
