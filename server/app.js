const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const artisanRoutes = require("./routes/artisanRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require('./routes/chatRoutes');
const app = express();

app.use(
  cors({
    origin: ["https://desi-etsy.vercel.app", "https://desi-etsy-him3s-projects.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/artisans", artisanRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);
app.use('/chat', chatRoutes);

app.get("/", (req, res) => {
  return res.send("API Working");
});

module.exports = app;
