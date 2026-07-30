const express = require("express");

const {
  getUserController,
  updateUserController,
  updatePasswordController,
  resetPasswordController,
  deleteProfileController,
  updateUserRoleController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// GET CURRENT USER
router.get("/", authMiddleware, getUserController);

// UPDATE PROFILE
router.put("/", authMiddleware, updateUserController);

// UPDATE PASSWORD
router.put(
  "/password",
  authMiddleware,
  updatePasswordController
);

// DELETE USER
router.delete(
  "/:id",
  authMiddleware,
  deleteProfileController
);

// UPDATE USER ROLE (ADMIN ONLY)
router.put(
  "/role/:id",
  authMiddleware,
  adminMiddleware,
  updateUserRoleController
);

module.exports = router;