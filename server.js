const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// dotenv configuration
dotenv.config();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Interactive API documentation and raw OpenAPI specification.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.status(200).json(swaggerSpec));

// routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoutes"));

// home route
app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<h1>Welcome to Food Server App API BASE PROJECT</h1>");
});

// PORT
const PORT = process.env.PORT || 8080;

// Start Server
const startServer = async () => {
  try {
    // Database connection
    await connectDB();

    // Redis connection
    await connectRedis();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`.white.bgMagenta);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
