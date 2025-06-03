const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
  sendOTP,
  verifyOTP,
  forgotPassword
} = require("../controllers/authController");
const { verfiyuser } = require("../middlewares/authMiddleware");
const authRouter = express.Router();

// Signup flow
authRouter.post("/signup", signup);
authRouter.post("/verify-signup-otp", verifyOTP);

// Login
authRouter.post("/login", login);

// Password management
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", verfiyuser, changePassword);

// Logout
authRouter.post("/logout", verfiyuser, logout);

module.exports = authRouter;
