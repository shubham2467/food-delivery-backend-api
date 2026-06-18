const restaurantModel = require("../models/restaurantModel");

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

    // validation
    if (!title || !coords) {
      return res.status(400).send({
        success: false,
        message: "Please provide title and address",
      });
    }

    // create new restaurant
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

    // save data
    await newRestaurant.save();

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
    const restaurants = await restaurantModel.find({});

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Restaurant Available",
      });
    }

    res.status(200).send({
      success: true,
      totalCount: restaurants.length,
      restaurants,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
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
      error,
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
        message: "No Restaurant Found OR Provide Restaurant ID",
      });
    }

    await restaurantModel.findByIdAndDelete(restaurantId);

    res.status(200).send({
      success: true,
      message: "Restaurant Deleted Successfully",
    });

    if (!restaurantId) {
      return res.status(500).send({
        success: false,
        message: "No Restaurant Found",
      });
    }

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Delete Restaurant API",
      error,
    });
  }
};

// UPDATE RESTAURANT
const updateRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Restaurant Updated Successfully",
      updatedRestaurant,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Update Restaurant API",
      error,
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