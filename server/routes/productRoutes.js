const express = require("express");
const router = express.Router();
const { verifyuser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const upload = require("../config/upload");
const {
  create_product,
  view_products,
  get_product,
  update_product,
  delete_product,
  view_artisan_products,
} = require("../controllers/productController");

// Create product - Artisan only
router.post(
  "/create_product",
  verifyuser,
  requireRole("artisan"),
  upload.array("images", 5),
  create_product
);

// Get all approved products - Public
router.get("/view_products", view_products);

// Get artisan's own products - Artisan only
router.get("/view_artisan_products", verifyuser, requireRole("artisan"), view_artisan_products);

// Get single product - Public
router.get("/get_product/:id", get_product);

// Update product - Artisan only
router.put("/update_product/:id", verifyuser, requireRole("artisan"), upload.array("images", 5), update_product);

// Delete product - Artisan only
router.delete(
  "/delete_product/:id",
  verifyuser,
  requireRole("artisan"),
  delete_product
);

module.exports = router;
