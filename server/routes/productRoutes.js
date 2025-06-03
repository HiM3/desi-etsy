const express = require("express");
const router = express.Router();
const { verfiyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const upload = require("../config/upload");
const {
  create_product,
  view_products,
  get_product,
  update_product,
  delete_product,
} = require("../controllers/productController");

// Create product - Artisan only
router.post(
  "/product",
  verfiyuser,
  requireRole("artisan"),
  upload.array("images", 5),
  create_product
);

// Get all products - Public
router.get("/products", view_products);

// Get single product - Public
router.get("/product/:id", get_product);

// Update product - Artisan only
router.put("/product/:id", verfiyuser, requireRole("artisan"), update_product);

// Delete product - Artisan only
router.delete(
  "/product/:id",
  verfiyuser,
  requireRole("artisan"),
  delete_product
);

module.exports = router;
