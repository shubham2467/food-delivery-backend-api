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

    // validation
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !code
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // create food
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

    // Clear Redis cache
    await redisClient.del("allFoods");
    console.log("🗑️ Redis Cache Cleared (allFoods)");

    res.status(201).send({
      success: true,
      message: "New Food Item Created",
      newFood,
    });

  } catch (error) {
    console.log(error.stack);

    res.status(500).send({
      success: false,
      message: "Error in create food API",
      error: error.stack,
    });
  }
};