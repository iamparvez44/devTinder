const express = require("express");
const { userAuth } = require("../middleware/userAuth.js");
const profileRoutes = express.Router();


profileRoutes.get("/profile", userAuth, (req, res) => {
  const user = req.user;

  try {
    res.send({
      msg: "User fetch succefully",
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
});

module.exports = profileRoutes;
