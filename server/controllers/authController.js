const User = require("../models/User");
const otp_generator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { HashPassword, PlainPassword } = require("../utils/password");
const sendMailer = require("../config/mailer");
const { use } = require("../routes/adminRoutes");

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

    const hashedPassword = await HashPassword(password);

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
      isVerified: false,
      otp,
      otpExpiry: new Date(Date.now() + 3 * 60 * 1000),
    });

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
            background-color: #fdf8f3;
          }

          .container {
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            padding: 20px;
            border-radius: 16px;
            line-height: 1.8;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            border-bottom: 2px solid #fdf8f3;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
          }

          .header a {
            font-size: 1.6em;
            color: #d35400;
            text-decoration: none;
            font-weight: 700;
          }

          .otp {
            background: linear-gradient(to right, #d35400 0, #b34700 100%);
            margin: 25px auto;
            width: max-content;
            padding: 15px 30px;
            color: #fff;
            border-radius: 12px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 3px;
            box-shadow: 0 4px 6px rgba(211, 84, 0, 0.2);
          }

          .footer {
            color: #666;
            font-size: 0.9em;
            line-height: 1.6;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #fdf8f3;
            text-align: center;
          }

          .email-info {
            color: #666;
            font-weight: 400;
            font-size: 14px;
            line-height: 1.6;
            padding: 20px 0;
            text-align: center;
          }

          .email-info a {
            text-decoration: none;
            color: #d35400;
          }

          .warning {
            background-color: #fff5f0;
            border-left: 4px solid #d35400;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
          }

          .warning strong {
            color: #d35400;
          }

          .warning ul {
            margin: 10px 0;
            padding-left: 20px;
          }

          .warning li {
            margin: 5px 0;
          }

          .content {
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
          }

          .greeting {
            font-size: 1.2em;
            color: #d35400;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a>Desi Etsy Email Verification</a>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${username},</div>
            <p>
              Welcome to Desi Etsy! Please verify your email address using the following
              One-Time Password (OTP):
            </p>
            
            <div class="otp">${otp}</div>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This OTP is valid for 3 minutes only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't create this account, please ignore this email</li>
              </ul>
            </div>

            <p>
              Best regards,<br>
              <strong>Desi Etsy Team</strong>
            </p>
          </div>

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
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await PlainPassword(current_password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
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
      message: "Failed to change password",
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
            background-color: #fdf8f3;
          }

          .container {
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            padding: 20px;
            border-radius: 16px;
            line-height: 1.8;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            border-bottom: 2px solid #fdf8f3;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
          }

          .header a {
            font-size: 1.6em;
            color: #d35400;
            text-decoration: none;
            font-weight: 700;
          }

          .otp {
            background: linear-gradient(to right, #d35400 0, #b34700 100%);
            margin: 25px auto;
            width: max-content;
            padding: 15px 30px;
            color: #fff;
            border-radius: 12px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 3px;
            box-shadow: 0 4px 6px rgba(211, 84, 0, 0.2);
          }

          .footer {
            color: #666;
            font-size: 0.9em;
            line-height: 1.6;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #fdf8f3;
            text-align: center;
          }

          .email-info {
            color: #666;
            font-weight: 400;
            font-size: 14px;
            line-height: 1.6;
            padding: 20px 0;
            text-align: center;
          }

          .email-info a {
            text-decoration: none;
            color: #d35400;
          }

          .warning {
            background-color: #fff5f0;
            border-left: 4px solid #d35400;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
          }

          .warning strong {
            color: #d35400;
          }

          .warning ul {
            margin: 10px 0;
            padding-left: 20px;
          }

          .warning li {
            margin: 5px 0;
          }

          .content {
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
          }

          .greeting {
            font-size: 1.2em;
            color: #d35400;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a>Desi Etsy Password Reset</a>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${checkUser.username},</div>
            <p>
              We received a request to reset your password. To proceed with the password reset,
              please use the following One-Time Password (OTP):
            </p>
            
            <div class="otp">${otp}</div>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This OTP is valid for 3 minutes only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>

            <p>
              Best regards,<br>
              <strong>Desi Etsy Team</strong>
            </p>
          </div>

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
    const { email, otp, type } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (otp === user.otp) {
      user.otp = undefined;
      user.otpExpiry = undefined;

      if (type === "signup" && user.role === "user") {
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
            isVerified: user.isVerified,
          },
        });
      } else {
        await user.save();
        return res.json({
          success: true,
          message: "OTP verified successfully",
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
    if (new_password != confirmpassword) {
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
