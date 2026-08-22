const express = require("express");
const { userAuth } = require("../middleware/userAuth.js");
const connectionRoutes = express.Router();


connectionRoutes.get("/sendConncetionRequest", userAuth, (req, res) => {
  const user = req.user;

  try {
    res.send(user.firstName + "send the conncetion request");
  } catch (error) {
    res.status(400).send("ERROR" + error.message);  
  }
});

module.exports = connectionRoutes;
