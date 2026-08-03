const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");
const categoryModel = require("../models/categoryModel");
const { redisClient } = require("../config/redis");

// CREATE FOOD
const createFoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imgUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount,
    } = req.body;

    if (!title || !description || !price || !category || !code) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const newFood = new foodModel({
      title,
      description,
      price,
      imgUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount,
    });

    await newFood.save();

    await redisClient.del("allFoods");

    res.status(201).send({
      success: true,
      message: "New Food Item Created",
      newFood,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in create food API",
      error: error.message,
    });
  }
};

// GET ALL FOODS
const getAllFoodsController = async (req, res) => {
  try {
    const cachedFoods = await redisClient.get("allFoods");

    if (cachedFoods) {
      return res.status(200).send({
        success: true,
        source: "Redis Cache",
        totalFoods: JSON.parse(cachedFoods).length,
        foods: JSON.parse(cachedFoods),
      });
    }

    const foods = await foodModel.find({});

    if (!foods || foods.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No food items found",
      });
    }

    await redisClient.setEx("allFoods", 60, JSON.stringify(foods));

    res.status(200).send({
      success: true,
      source: "MongoDB",
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Get Foods API",
      error: error.message,
    });
  }
};

// GET SINGLE FOOD
const getSingleFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;

    if (!foodId) {
      return res.status(404).send({
        success: false,
        message: "Please provide ID",
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found with this ID",
      });
    }

    res.status(200).send({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Get Single Food API",
      error: error.message,
    });
  }
};

// GET FOOD BY RESTAURANT
const getFoodByRestaurantController = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "Please provide restaurant ID",
      });
    }

    const food = await foodModel.find({
      restaurant: restaurantId,
    });

    if (!food || food.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No food found with this restaurant ID",
      });
    }

    res.status(200).send({
      success: true,
      message: "Food based on restaurant",
      food,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in get restaurant food API",
      error: error.message,
    });
  }
};

// UPDATE FOOD
const updateFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;

    if (!foodId) {
      return res.status(404).send({
        success: false,
        message: "No food ID found",
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found",
      });
    }

    const {
      title,
      description,
      price,
      imgUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount,
    } = req.body;

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      {
        title,
        description,
        price,
        imgUrl,
        foodTags,
        category,
        code,
        isAvailable,
        restaurant,
        rating,
        ratingCount,
      },
      { new: true }
    );

    await redisClient.del("allFoods");

    res.status(200).send({
      success: true,
      message: "Food Item Updated Successfully",
      updatedFood,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Update Food API",
      error: error.message,
    });
  }
};

// DELETE FOOD
const deleteFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;

    if (!foodId) {
      return res.status(404).send({
        success: false,
        message: "Provide food ID",
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with ID",
      });
    }

    await foodModel.findByIdAndDelete(foodId);

    await redisClient.del("allFoods");

    res.status(200).send({
      success: true,
      message: "Food Item Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in delete food API",
      error: error.message,
    });
  }
};

// PLACE ORDER
const placeOrderController = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart) {
      return res.status(400).send({
        success: false,
        message: "Please add food cart",
      });
    }

    let total = 0;

    cart.forEach((item) => {
      total += item.price;
    });

    const foodIds = cart.map((item) => item.id || item._id);

    const newOrder = new orderModel({
      foods: foodIds,
      payment: total,
      buyer: req.userId,
    });

    await newOrder.save();

    res.status(200).send({
      success: true,
      message: "Order placed successfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Place Order API",
      error: error.message,
    });
  }
};

// UPDATE ORDER STATUS
const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid order ID",
      });
    }

    const { status } = req.body;

    await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Order Status API",
      error: error.message,
    });
  }
};

// GET FOOD BY CATEGORY
const getFoodByCategoryController = async (req, res) => {
  try {
    const { title } = req.params;

    const category = await categoryModel.findOne({
      title: { $regex: title, $options: "i" },
    });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    const foods = await foodModel
      .find({ category: category._id })
      .populate("category");

    res.status(200).send({
      success: true,
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Get Food By Category API",
      error: error.message,
    });
  }
};

module.exports = {
  createFoodController,
  getAllFoodsController,
  getSingleFoodController,
  getFoodByRestaurantController,
  updateFoodController,
  deleteFoodController,
  placeOrderController,
  orderStatusController,
  getFoodByCategoryController,
};