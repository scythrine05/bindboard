const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Collaborative Whiteboard Server is running");
});

module.exports = router;
