const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {

    const token = req.headers["authorization"].split(" ")[1];

    // Verify JWT
    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.userId = decode.id || decode._id;

    // Find user
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Found",
      });
    }

    // Check active token
    if (user.activeToken !== token) {
      return res.status(401).send({
        success: false,
        message: "Session Expired. Please Login Again",
      });
    }

    next();

  } catch (error) {

    console.log(error);

    res.status(401).send({
      success: false,
      message: "Please Login Again",
      error: error.message,
    });

  }
};

module.exports = authMiddleware;