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

router.post(
  "/create_product",
  verifyuser,
  requireRole("artisan"),
  upload.array("images", 5),
  create_product
);

router.get("/view_products", view_products);

router.get("/view_artisan_products", verifyuser, requireRole("artisan"), view_artisan_products);

router.get("/get_product/:id", get_product);

router.put("/update_product/:id", verifyuser, requireRole("artisan"), upload.array("images", 5), update_product);

router.delete(
  "/delete_product/:id",
  verifyuser,
  requireRole("artisan"),
  delete_product
);

module.exports = router;
