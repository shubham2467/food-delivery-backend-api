const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// REGISTER
// REGISTER
const registerController = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      answer,
      usertype,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // check existing user
    const existing = await userModel.findOne({ email });

    if (existing) {
      return res.status(500).send({
        success: false,
        message: "Email Already Registered Please Login",
      });
    }

    // hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
      usertype: usertype || "client",
    });

    // hide password
    user.password = undefined;

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error: error.message,
    });

  }
};
// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email OR Password",
      });
    }

    // find user
    const user = await userModel.findOne({ email });

    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    
    // token
const token = JWT.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

// Save current active token
user.activeToken = token;
await user.save();

// hide password
user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

// LOGOUT
const logoutController = async (req, res) => {
  try {

    const user = await userModel.findById(req.userId);

    user.activeToken = null;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Logout Successfully",
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });

  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};