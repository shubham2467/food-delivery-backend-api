const categoryModel = require("../models/categoryModel");
const { redisClient } = require("../config/redis");

// CREATE CATEGORY
const createCatController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // Validation
    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Please provide category title",
      });
    }

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    const newCategory = new categoryModel({
      title: title.trim(),
      imageUrl,
    });

    await newCategory.save();

    // Clear Redis cache
    await redisClient.del("categories");

    res.status(201).send({
      success: true,
      message: "Category Created Successfully",
      newCategory,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Create Category API",
      error,
    });
  }
};

// GET ALL CATEGORIES
const getAllCatController = async (req, res) => {
  try {
    // Check Redis cache
    const cachedCategories = await redisClient.get("categories");

    if (cachedCategories) {
      return res.status(200).send({
        success: true,
        source: "Redis Cache",
        totalCat: JSON.parse(cachedCategories).length,
        categories: JSON.parse(cachedCategories),
      });
    }

    // Fetch from MongoDB
    const categories = await categoryModel.find({});

    if (!categories || categories.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Categories Found",
      });
    }

    // Save in Redis for 5 minutes
    await redisClient.set(
      "categories",
      JSON.stringify(categories),
      {
        EX: 300,
      }
    );

    res.status(200).send({
      success: true,
      source: "MongoDB",
      totalCat: categories.length,
      categories,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Get All Category API",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
const updateCatController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl } = req.body;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { title, imageUrl },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({
        success: false,
        message: "No Category Found",
      });
    }

    // Clear Redis cache
    await redisClient.del("categories");

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      updatedCategory,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Update Category API",
      error: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCatController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Category ID",
      });
    }

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "No Category Found With This ID",
      });
    }

    await categoryModel.findByIdAndDelete(id);

    // Clear Redis cache
    await redisClient.del("categories");

    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Delete Category API",
      error: error.message,
    });
  }
};

module.exports = {
  createCatController,
  getAllCatController,
  updateCatController,
  deleteCatController,
};