const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
    registerController,
    loginController,
    logoutController,
} = require("../controllers/authControllers");

const router = express.Router();

// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//LOGOUT
router.post(
  "/logout",
  authMiddleware,
  logoutController
);

module.exports = router;