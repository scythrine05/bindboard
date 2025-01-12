require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  EXPIRE_TIME: process.env.EXPIRY_TIME || 7200,
};
