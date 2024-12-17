const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.connect().catch(console.error);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;