const jwt = require("jsonwebtoken");

exports.verifyuser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }
    token = token.split(" ")[1];
    const verfiyuser = jwt.verify(token, process.env.secret_key);
    if (!verfiyuser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    req.user = verfiyuser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};
