const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
} = require("../controllers/authController");
const { verfiyuser } = require("../middlewares/authMiddleware");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);

authRouter.post("/logout", verfiyuser, logout);
authRouter.post("/changePassword", verfiyuser, changePassword);

module.exports = authRouter;
