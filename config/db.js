const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected To Database ${mongoose.connection.host}`.bgWhite.black
    );
  } catch (error) {
    console.log("DB Error:", error.message);
    throw error; // <-- Important
  }
};

module.exports = connectDB;