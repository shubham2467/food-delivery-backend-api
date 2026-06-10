const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { createFoodController, getAllFoodsController, getSingleFoodController, getFoodByResturantController, updateFoodController, deleteFoodController, placeOrderController, orderStatusController, getFoodByCategoryController } = require("../controllers/foodController");


const router = express.Router();

//routes
//CREATE FOOD
router.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  createFoodController
);

//GET ALL FOOD
router.get('/getAll', getAllFoodsController);

//GET SINGLE FOOD
router.get('/get/:id', getSingleFoodController);

//GET FOOD BY RESTURANT
router.get('/getByResturant/:id', getFoodByResturantController );

//UPDATE FOOD
router.put(
  '/update/:id',
  authMiddleware,
  adminMiddleware,
  updateFoodController
);

//DELETE FOOD
router.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  deleteFoodController
);

//PLACE ORDER
router.post('/placeorder', authMiddleware, placeOrderController);

//ORDER STATUS
router.post('/orderStatus/:id', authMiddleware, adminMiddleware, orderStatusController);

//FOOD CATEGORY
router.get("/getByCategory/:title", getFoodByCategoryController);
module.exports = router;