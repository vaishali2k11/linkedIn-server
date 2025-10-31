const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

exports.authAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "No token, authorization denied",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRECT_KEY);
    req.user = await UserModel.findById(decode.userId).select("-password");
    next();
  } catch (error) {
    console.log("error in authAuthentication():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};
