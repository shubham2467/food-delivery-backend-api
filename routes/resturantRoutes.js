const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
    createResturantController,
    getAllResturantController,
    getResturantByIdController,
    deleteResturantController,
    updateResturantController,
} = require("../controllers/resturantController");

const router = express.Router();

//routes
// CREATE RESTURANT || POST
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createResturantController
);

//GET ALL RESTURANT || GET
router.get('/getAll', authMiddleware, getAllResturantController);

//GET RESTURANT BY ID || GET
router.get('/get/:id',getResturantByIdController);

//DELETE RESTURANT || DELETE
router.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  deleteResturantController
);

// UPDATE RESTURANT
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateResturantController,
);

module.exports = router;