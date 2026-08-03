const restaurantModel = require("../models/restaurantModel");
const { redisClient } = require("../config/redis");

// CREATE RESTAURANT
const createRestaurantController = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    } = req.body;

    // Validation
    if (!title || !coords) {
      return res.status(400).send({
        success: false,
        message: "Please provide title and address",
      });
    }

    // Create restaurant
    const newRestaurant = new restaurantModel({
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    });

    await newRestaurant.save();

    // Clear Redis cache
    await redisClient.del("restaurants");

    res.status(201).send({
      success: true,
      message: "New Restaurant Created Successfully",
      newRestaurant,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Create Restaurant API",
      error: error.message,
    });
  }
};

// GET ALL RESTAURANTS
const getAllRestaurantController = async (req, res) => {
  try {
    console.log("Restaurant API called");

    // Check Redis cache
    const cachedRestaurants = await redisClient.get("restaurants");

    if (cachedRestaurants) {
      return res.status(200).send({
        success: true,
        source: "Redis Cache",
        totalCount: JSON.parse(cachedRestaurants).length,
        restaurants: JSON.parse(cachedRestaurants),
      });
    }

    // Fetch from MongoDB
    const restaurants = await restaurantModel.find({});

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Restaurant Available",
      });
    }

    // Store data in Redis for 5 minutes
    await redisClient.set(
      "restaurants",
      JSON.stringify(restaurants),
      {
        EX: 300,
      }
    );

    return res.status(200).send({
      success: true,
      source: "MongoDB",
      totalCount: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error In Get All Restaurant API",
      error: error.message,
    });
  }
};

// GET RESTAURANT BY ID
const getRestaurantByIdController = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Restaurant ID",
      });
    }

    const restaurant = await restaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "No Restaurant Found",
      });
    }

    res.status(200).send({
      success: true,
      restaurant,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Get Restaurant By ID API",
      error: error.message,
    });
  }
};

// DELETE RESTAURANT
const deleteRestaurantController = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "Please provide restaurant ID",
      });
    }

    const restaurant = await restaurantModel.findByIdAndDelete(
      restaurantId
    );

    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Clear Redis cache
    await redisClient.del("restaurants");

    res.status(200).send({
      success: true,
      message: "Restaurant Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Delete Restaurant API",
      error: error.message,
    });
  }
};

const updateRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    const { _id, ...updateData } = req.body;

    const updatedRestaurant =
      await restaurantModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

    if (!updatedRestaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    await redisClient.del("restaurants");

    res.status(200).send({
      success: true,
      message: "Restaurant Updated Successfully",
      updatedRestaurant,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Update Restaurant API",
      error: error.message,
    });
  }
};

module.exports = {
  createRestaurantController,
  getAllRestaurantController,
  getRestaurantByIdController,
  deleteRestaurantController,
  updateRestaurantController,
};