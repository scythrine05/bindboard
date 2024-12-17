const redisClient = require('../configs/redis.config.js')

const set = async (key, value, expiration = null) => {
  try {
    await redisClient.set(key, JSON.stringify(value));
    if (expiration) {
      await redisClient.expire(key, expiration);
    }
  } catch (err) {
    console.error("Redis SET error:", err);
  }
};

const get = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis GET error:", err);
  }
};

const del = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error("Redis DEL error:", err);
  }
};

const hSet = async (key, field, value) => {
  try {
    await redisClient.hSet(key, field, JSON.stringify(value));
  } catch (err) {
    console.error("Redis HSET error:", err);
  }
};

const hGetAll = async (key) => {
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
};

const hDel = async (key, field) => {
  try {
    await redisClient.hDel(key, field);
  } catch (err) {
    console.error("Redis HDEL error:", err);
  }
};

module.exports = {
  set,
  get,
  del,
  hSet,
  hGetAll,
  hDel,
};
