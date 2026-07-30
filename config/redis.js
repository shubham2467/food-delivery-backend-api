require("dotenv").config();

const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected To Redis");
  } catch (error) {
    console.error("Redis Connection Error:", error);
    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};