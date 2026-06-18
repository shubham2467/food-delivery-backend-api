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
  "/",
  authMiddleware,
  adminMiddleware,
  createCatController
);

// GET ALL CATEGORIES
router.get(
  "/",
  getAllCatController
);

// UPDATE CATEGORY
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCatController
);

// DELETE CATEGORY
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCatController
);

module.exports = router;