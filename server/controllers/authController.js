const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { HashPassword, PlainPassword } = require("../utils/password");

exports.signup = async (req, res) => {
  const { username, email, gender, password, confirmpassword, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    if (password !== confirmpassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await HashPassword(password);

    const user = await User.create({
      username,
      email,
      gender,
      password: hashedPassword,
      role: role || "user",
      isVerified: role === "artisan" ? false : true,
    });

    return res.json({
      success: true,
      message: `${role || "User"} account created successfully`,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not found. Please sign up.",
      });
    }

    const isMatch = await PlainPassword(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Artisan check
    if (user.role === "artisan" && !user.isVerified) {
      return res.json({
        success: false,
        message: "Artisan account pending approval by admin",
      });
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.secret_key, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  const token = req.user.authorization;
  if (!token) {
    return res.json({
      success: false,
      message: "Token not found",
    });
  } else {
    res.clearCookie("user");
    res.removeHeader("user");
    res.json({
      success: true,
      message: "Logout Successfully",
    });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { current_password, new_password, confirmpassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await PlainPassword(current_password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong current password" });
    }

    if (new_password !== confirmpassword) {
      return res.json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const hashedPassword = await HashPassword(new_password);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password change failed",
      error: error.message,
    });
  }
};
