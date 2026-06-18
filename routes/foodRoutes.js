const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  createFoodController,
  getAllFoodsController,
  getSingleFoodController,
  getFoodByRestaurantController,
  updateFoodController,
  deleteFoodController,
  placeOrderController,
  orderStatusController,
  getFoodByCategoryController,
} = require("../controllers/foodController");

const router = express.Router();

// CREATE FOOD
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createFoodController
);

// GET ALL FOODS
router.get("/", getAllFoodsController);

// GET FOOD BY RESTAURANT
router.get(
  "/restaurant/:id",
  getFoodByRestaurantController
);

// GET FOOD BY CATEGORY
router.get(
  "/category/:title",
  getFoodByCategoryController
);

// GET SINGLE FOOD
router.get(
  "/:id",
  getSingleFoodController
);

// UPDATE FOOD
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateFoodController
);

// DELETE FOOD
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteFoodController
);

// PLACE ORDER
router.post(
  "/place-order",
  authMiddleware,
  placeOrderController
);

// ORDER STATUS UPDATE
router.put(
  "/order-status/:id",
  authMiddleware,
  adminMiddleware,
  orderStatusController
);

module.exports = router;