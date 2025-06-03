const mongoose = require("mongoose");
const dbconfig = () => {
  mongoose
    .connect(process.env.MongoDB)
    .then(() => {
      console.log("MongoDB connected successfully ✅");
    })
    .catch((err) => {
      console.log("MongoDB connection failed ❌");
    });
};

module.exports = dbconfig;
