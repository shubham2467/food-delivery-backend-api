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

//routes

// GET USER || GET
router.get("/getUser", authMiddleware, getUserController);

// UPDATE PROFILE
router.put("/updateUser", authMiddleware, updateUserController);

//password update
router.put("/updatePassword", authMiddleware, updatePasswordController);

//RESET PASSWORD
router.post("/resetPassword", authMiddleware, resetPasswordController );

//DELETE USER
router.delete('/deleteUser/:id', authMiddleware, deleteProfileController);

// UPDATE USER ROLE
router.put(
  "/updateUserRole/:id",
  authMiddleware,
  adminMiddleware,
  updateUserRoleController,
);

module.exports = router;