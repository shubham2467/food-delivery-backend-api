const categoryModel = require("../models/categoryModel");

// CREATE CAT
const createCatController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    //valdn
    if (!title) {
      return res.status(500).send({
        success: false,
        message: "please provide category title or image",
      });
    }

    const newCategory = new categoryModel({ title, imageUrl });
    await newCategory.save();

    res.status(201).send({
      success: true,
      message: "category created",
      newCategory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Create Cat API",
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