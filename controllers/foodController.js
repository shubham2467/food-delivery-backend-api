const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");
const categoryModel = require("../models/categoryModel");
const { redisClient } = require("../config/redis");

//CREATE FOOD
//CREATE FOOD
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
      return res.status(500).send({
        success: false,
        message: "Please Provide all fields",
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
      resturant,
      rating,
      ratingCount,
    });

    await newFood.save();
    // Clear foods cache
    await redisClient.del("allFoods");
    console.log("🗑️ Redis Cache Cleared (allFoods)");

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

//GET ALL FOOD
// GET ALL FOOD
const getAllFoodsController = async (req, res) => {
    try {

        // 1. Check Redis Cache
        const cachedFoods = await redisClient.get("allFoods");

        if (cachedFoods) {
            console.log("✅ Cache Hit");

            return res.status(200).send({
                success: true,
                source: "Redis Cache",
                totalFoods: JSON.parse(cachedFoods).length,
                foods: JSON.parse(cachedFoods),
            });
        }

        console.log("❌ Cache Miss");

        // 2. Fetch from MongoDB
        const foods = await foodModel.find({});

        if (!foods || foods.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No food items found",
            });
        }

        // 3. Store in Redis for 60 seconds
        await redisClient.setEx(
            "allFoods",
            60,
            JSON.stringify(foods)
        );

        // 4. Return MongoDB Data
        return res.status(200).send({
            success: true,
            source: "MongoDB",
            totalFoods: foods.length,
            foods,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error in Get Foods API",
            error: error.message,
        });
    }
};

// GET SINGLE FOOD
const getSingleFoodController = async(req, res) => {
    try{
        const foodId = req.params.id 
        if(!foodId){
            return res.status(404).send({
                success:false,
                message:'Please provide Id'
            })
        }
        const food = await foodModel.findById(foodId)
        if(!food){
            return res.status(404).send({
                success:false,
                message:'No Food Found with this id'
            })
        }
        res.status(200).send({
            success:true,
            food,
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In get Single API'
        })
    }
};

//GET FOOD BY RESTURANT
//GET FOOD BY RESTURANT
const getFoodByRestaurantController = async (req, res) => {
    try {

        const resturantId = req.params.id;

        if (!resturantId) {
            return res.status(404).send({
                success: false,
                message: 'Please provide restaurant Id'
            });
        }

        const food = await foodModel.find({
            resturant: resturantId
        });

        if (!food || food.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No food found with this restaurant id'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Food based on restaurant',
            food,
        });

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: 'Error In get restaurant food API',
            error: error.message
        });
    }
};

//UPDATE FOOD ITEM
const updateFoodController = async(req, res) => {
    try{
        const foodId = req.params.id 
        if(!foodId){
            return res.status(404).send({
                success:false,
                message:'No food id was found'
            })
        }
        const food = await foodModel.findById(foodId)
        if(!food){
            return res.status(404).send({
                success:false,
                message:'No Food Found'
            })
        }
        const {title, description, price, imgUrl,foodTags,category,code, isAvailable, resturant, rating} = req.body
        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
            title, description, price, imgUrl,foodTags,category,code, isAvailable, resturant, rating
        }, {new:true})
        // Clear foods cache
        await redisClient.del("allFoods");
        console.log("🗑️ Redis Cache Cleared (allFoods)");
        res.status(200).send({
            success:true,
            message:'Food Item Was Updated',
            updatedFood,
        })
    }catch(error){
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Error in Update Food API',
            error: error.message,
        })
    }
};

//DELETE FOOD 
const deleteFoodController = async(req, res) => {
    try{
        const foodId = req.params.id
        if(!foodId){
            return res.status(404).send({
                success:false,
                message:'provide food id',
            })
        }
        const food = await foodModel.findById(foodId)
        if(!food){
            return res.status(404).send({
                success:false,
                message:'No food found with id'
            })
        }
        await foodModel.findByIdAndDelete(foodId)
        // Clear foods cache
        await redisClient.del("allFoods");
        console.log("🗑️ Redis Cache Cleared (allFoods)");
        res.status(200).send({
            success:true,
            message:'Food item Deleted',
        })
    }catch(error){
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Error in delete food API',
            error: error.message,
        })
    }
};

//PLACE ORDER 
//PLACE ORDER
const placeOrderController = async (req, res) => {
    try {

        const { cart } = req.body;

        if (!cart) {
            return res.status(500).send({
                success: false,
                message: "Please Add Food Cart",
            });
        }

        let total = 0;

        //calculate total
        cart.map((i) => {
            total += i.price;
        });

        //get only food ids
        const foodIds = cart.map((item) => item.id || item._id);

        //create order
        const newOrder = new orderModel({
            foods: foodIds,
            payment: total,
            buyer: req.userId,
        });

        await newOrder.save();

        res.status(200).send({
            success: true,
            message: "Order Placed Successfully",
            newOrder,
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error In Place Order API",
            error: error.message,
        });
    }
};

//CHANGE ORDER STATUS
const orderStatusController = async(req, res) => {
    try{
        const orderId = req.params.id
        if(!orderId){
            return res.status(404).send({
                success:false,
                message:'Please Provide valid order id'
            })
        }
        const {status} = req.body
        const order = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true})
        res.status(200).send({
            success:true,
            message:'Order status Updated'
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Order Status API',
            error: error.message,
        })
    }
};
//FOOD BY CATEFORY
const getFoodByCategoryController = async (req, res) => {
  try {
    const { title } = req.params;

    // find category by title
    const category = await categoryModel.findOne({
      title: { $regex: title, $options: "i" }
    });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }

    // find foods using category id
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
      message: "Error In Get Food By Category API",
      error: error.message,
    });
  }
};
module.exports = { createFoodController, getAllFoodsController, getSingleFoodController, getFoodByRestaurantController, deleteFoodController, updateFoodController, placeOrderController, orderStatusController, getFoodByCategoryController};