const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  gender: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'artisan', 'admin'],
    default: 'user'
  },

  isVerified: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
