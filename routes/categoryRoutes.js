const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  createCatController,
  getAllCatController,
  updateCatController,
  deleteCatController,
} = require("../controllers/categoryController");

const router = express.Router();

// CREATE CATEGORY
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createCatController
);

// GET ALL CATEGORIES
router.get("/getAll", getAllCatController);

//UPDATE CAT
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateCatController
);

//DELETE CAT
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteCatController
);

module.exports = router;