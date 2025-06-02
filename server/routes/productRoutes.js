const express = require("express");
const router = express.Router();
const { verfiyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const upload = require("../config/upload");
const { create_product } = require("../controllers/productController");

router.post(
  "/product",
  verfiyuser,
  requireRole("artisan"),
  upload.array("images", 5),
  create_product
);

module.exports = router;
