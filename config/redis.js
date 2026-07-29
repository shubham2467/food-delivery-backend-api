const { createClient } = require("redis");

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Error Event
redisClient.on("error", (err) => {
  console.log("Redis Error:", err.message);
});

// Connect Function
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected To Redis");
  } catch (error) {
    console.log("Redis Connection Error:", error.message);
    throw error; // <-- Important
  }
};

module.exports = {
  redisClient,
  connectRedis,
};