const User = require("../models/User");
const otp_generator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { HashPassword, PlainPassword } = require("../utils/password");
const sendMailer = require("../config/mailer");

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

    // Generate OTP for email verification
    const otp = otp_generator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const user = await User.create({
      username,
      email,
      gender,
      password: hashedPassword,
      role: role || "user",
      isVerified: false, // Set to false until OTP is verified
      otp,
      otpExpiry: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes expiry
    });

    // Send verification email
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Email Verification</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #333;
            background-color: #fff;
          }

          .container {
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            padding: 20px;
            border-radius: 5px;
            line-height: 1.8;
          }

          .header {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .header a {
            font-size: 1.4em;
            color: #000;
            text-decoration: none;
            font-weight: 600;
          }

          .otp {
            background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
            margin: 20px auto;
            width: max-content;
            padding: 10px 20px;
            color: #fff;
            border-radius: 4px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .footer {
            color: #aaa;
            font-size: 0.8em;
            line-height: 1.5;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }

          .email-info {
            color: #666666;
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            padding-bottom: 6px;
            text-align: center;
          }

          .email-info a {
            text-decoration: none;
            color: #00bc69;
          }

          .warning {
            color: #dc3545;
            font-size: 0.9em;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a>Desi Etsy Email Verification</a>
          </div>
          
          <strong>Dear ${username},</strong>
          <p>
            Welcome to Desi Etsy! Please verify your email address using the following
            One-Time Password (OTP):
          </p>
          
          <div class="otp">${otp}</div>
          
          <p class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This OTP is valid for 3 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't create this account, please ignore this email</li>
            </ul>
          </p>

          <p>
            Best regards,<br>
            <strong>Desi Etsy Team</strong>
          </p>

          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>For support, please contact our customer service team.</p>
          </div>
        </div>

        <div class="email-info">
          <p>This email was sent to ${email}</p>
          <p>&copy; ${new Date().getFullYear()} Desi Etsy. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await sendMailer(email, "Email Verification OTP", emailTemplate);

    return res.json({
      success: true,
      message:
        "Account created successfully. Please verify your email with the OTP sent.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
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

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.json({
        success: false,
        message: "Email doesn't exist",
      });
    }

    const otp = otp_generator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    checkUser.otp = otp;
    checkUser.otpExpiry = new Date(Date.now() + 3 * 60 * 1000);
    await checkUser.save();

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset OTP</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #333;
            background-color: #fff;
          }

          .container {
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            padding: 20px;
            border-radius: 5px;
            line-height: 1.8;
          }

          .header {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .header a {
            font-size: 1.4em;
            color: #000;
            text-decoration: none;
            font-weight: 600;
          }

          .otp {
            background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
            margin: 20px auto;
            width: max-content;
            padding: 10px 20px;
            color: #fff;
            border-radius: 4px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .footer {
            color: #aaa;
            font-size: 0.8em;
            line-height: 1.5;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }

          .email-info {
            color: #666666;
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            padding-bottom: 6px;
            text-align: center;
          }

          .email-info a {
            text-decoration: none;
            color: #00bc69;
          }

          .warning {
            color: #dc3545;
            font-size: 0.9em;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a>Desi Etsy Password Reset</a>
          </div>
          
          <strong>Dear ${checkUser.username},</strong>
          <p>
            We received a request to reset your password. To proceed with the password reset,
            please use the following One-Time Password (OTP):
          </p>
          
          <div class="otp">${otp}</div>
          
          <p class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This OTP is valid for 3 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </p>

          <p>
            Best regards,<br>
            <strong>Desi Etsy Team</strong>
          </p>

          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>For support, please contact our customer service team.</p>
          </div>
        </div>

        <div class="email-info">
          <p>This email was sent to ${email}</p>
          <p>&copy; ${new Date().getFullYear()} Desi Etsy. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await sendMailer(email, "Password Reset OTP", emailTemplate);

    return res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body; // type can be 'signup' or 'forgot-password'
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP exists and hasn't expired
    if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (otp === user.otp) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      
      // Set isVerified to true for signup verification
      if (type === "signup") {
        user.isVerified = true;
        await user.save();
        return res.json({
          success: true,
          message: "Email verified successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
          }
        });
      } else {
        await user.save();
        return res.json({
          success: true,
          message: "OTP verified successfully"
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, new_password, confirmpassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    if (user.otp !== null) {
      return res.json({
        success: false,
        message: "Please verify OTP first",
      });
    }
    if (new_password !== confirmpassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const hashedPassword = await HashPassword(new_password);
    user.password = hashedPassword;
    await user.save();
    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
