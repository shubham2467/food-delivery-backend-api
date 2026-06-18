const categoryModel = require("../models/categoryModel");

// CREATE CAT
// CREATE CATEGORY
const createCatController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // validation
    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Please provide category title",
      });
    }

    // Check if category already exists (case-insensitive)
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

//GET ALL CAT
const getAllCatController = async(req, res) => {
  try{
    const categories = await categoryModel.find({})
    if(!categories){
      res.status(404).send({
        success:false,
        message:'No Categories found'
      })
    }
    res.status(200).send({
      success:true,
      totalCat: categories.length,
      categories,
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error in get All Category API'
    })
  }
};

//UPDATE CAT
const updateCatController = async(req, res) => {
  try{
    const {id} = req.params
    const{title, imageUrl} = req.body
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, {title, imageUrl}, {new:true})
    if(!updatedCategory){
      return res.status(404).send({
        success: false,
        message:'No Category Found'
      })
    }
    res.status(200).send({
      success:true,
      message:'Category updated Successfully'
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'error in update cat api'
    })
  }
};

//DELETE CAT
const deleteCatController = async (req, res) => {
  try{
    const {id} = req.params
    if(!id){
      return res.status(500).send({
        success:false,
        message:'Please Provide Category ID'
      })
    }
    const category = await categoryModel.findById(id)
    if(!category){
      return res.status(404).send({
        success:false,
        message:'No Category Found With this id'
      })
    }
    await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success:true,
      message:'category Deleted Successfully'
    })
  }catch(error){
    res.status(500).send({
      success:false,
      message:'Error in Delete Cat API',
      error,
    })
  }
};

module.exports = { createCatController, getAllCatController, updateCatController, deleteCatController, };