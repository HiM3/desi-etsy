const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  handlePaymentStatus,
  getPaymentStatus,
} = require("../controllers/paymentController");
const { verifyuser } = require("../middlewares/authMiddleware");

router.post("/create-payment-intent", verifyuser, createPaymentIntent);

router.post("/payment-status", verifyuser, handlePaymentStatus);

router.get("/status/:orderId", verifyuser, getPaymentStatus);

module.exports = router;
