const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");




const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("token is not valid !!!!!");
    }

    const decodedObj = await jwt.verify(token, "CaptanAmerica");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  userAuth,
};
