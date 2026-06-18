const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  createRestaurantController,
  getAllRestaurantController,
  getRestaurantByIdController,
  deleteRestaurantController,
  updateRestaurantController,
} = require("../controllers/restaurantController");

const router = express.Router();

// CREATE RESTAURANT
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createRestaurantController
);

// GET ALL RESTAURANTS
router.get(
  "/",
  authMiddleware,
  getAllRestaurantController
);

// GET RESTAURANT BY ID
router.get(
  "/:id",
  getRestaurantByIdController
);

// UPDATE RESTAURANT
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateRestaurantController
);

// DELETE RESTAURANT
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteRestaurantController
);

module.exports = router;