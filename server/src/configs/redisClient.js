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

module.exports = {
  redisClient,

  set: async (key, value, expiration = null) => {
    try {
      await redisClient.set(key, JSON.stringify(value));
      if (expiration) {
        await redisClient.expire(key, expiration);
      }
    } catch (err) {
      console.error("Redis SET error:", err);
    }
  },

  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Redis GET error:", err);
    }
  },

  // Wrapper for Redis DEL command
  del: async (key) => {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error("Redis DEL error:", err);
    }
  },

  hSet: async (key, field, value) => {
    try {
      await redisClient.hSet(key, field, JSON.stringify(value));
    } catch (err) {
      console.error("Redis HSET error:", err);
    }
  },

  hGetAll: async (key) => {
    try {
      const data = await redisClient.hGetAll(key);
      const parsedData = {};
      for (let field in data) {
        parsedData[field] = JSON.parse(data[field]);
      }
      return parsedData;
    } catch (err) {
      console.error("Redis HGETALL error:", err);
    }
  },

  hDel: async (key, field) => {
    try {
      await redisClient.hDel(key, field);
    } catch (err) {
      console.error("Redis HDEL error:", err);
    }
  },
};
