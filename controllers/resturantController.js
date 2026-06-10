const resturantModel = require("../models/resturantModel");

// CREATE RESTURANT
const createResturantController = async (req, res) => {
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
    const newResturant = new resturantModel({
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
    await newResturant.save();

    res.status(201).send({
      success: true,
      message: "New Resturant Created Successfully",
      newResturant,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Create Resturant API",
      error: error.message,
    });
  }
};

// GET ALL RESTURANTS
const getAllResturantController = async (req, res) => {
  try {
    const resturants = await resturantModel.find({});

    if (!resturants || resturants.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Resturant Available",
      });
    }

    res.status(200).send({
      success: true,
      totalCount: resturants.length,
      resturants,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Get All Resturant API",
      error: error.message,
    });
  }
};
//GET RESTURANT BY ID
const getResturantByIdController = async (req, res) => {
    try{
        const resturantId = req.params.id 
        if(!resturantId){
            return res.status(404).send({
                success:false,
                message:"please Provide Resturant ID"
            })
        }
        //find resturant
        const resturant  = await resturantModel.findById(resturantId)
        if(!resturant){
            return res.status(404).send({
                success:false,
                message:'no resturant found'
            })
        }
        res.status(200).send({
            success:true,
            resturant,
        })
    
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Get Resturant by id api',
            error
        })
    }
};
//DELETE RESTURANT
const deleteResturantController = async (req, res) => {
    try{
        const resturantId = req.params.id 
        if(!resturantId){
            return res.status(404).send({
                success:false,
                message:'No Resturant Found OR Provide Resturant ID'
            })
        }
        await resturantModel.findByIdAndDelete(resturantId);
        res.status(200).send({
            success:true,
            message:"Resturant Deleted Successfully",
        })
        if(!resturantId){
            return res.status(500).send({
                success:false,
                message:'No Resturant Found'
            })
        }
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in delete resturants api",
            error,
        })
    }
};

// UPDATE RESTURANT
const updateResturantController = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedResturant = await resturantModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedResturant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Restaurant Updated Successfully",
      updatedResturant,
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
  createResturantController,
  getAllResturantController,
  getResturantByIdController,
  deleteResturantController,
  updateResturantController,
};