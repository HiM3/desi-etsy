const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
  sendOTP,
  verifyOTP,
  forgotPassword,
} = require("../controllers/authController");
const { verifyuser } = require("../middlewares/authMiddleware");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/verify-signup-otp", verifyOTP);

authRouter.post("/login", login);

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", verifyuser, changePassword);

authRouter.post("/logout", verifyuser, logout);

module.exports = authRouter;
