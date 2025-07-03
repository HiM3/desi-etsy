const express = require("express");
const { verifyuser } = require("../middlewares/authMiddleware");
const {
  getChatHistory,
  sendMessage,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/history", verifyuser, getChatHistory);
router.post("/message", verifyuser, sendMessage);

module.exports = router;
