const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const userFunc = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.model.js");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// this API is use to get intrested connections LIST

userFunc.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data Fetch Succefully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// now this api will work for accepted conncetions LIST

userFunc.get("/user/conncetions", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);

    const connetions = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("toUserId fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data Fetch Succefully",
      data: connetions,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err);
  }
});

// this is my feed API, this api is responsble to show the cards for users and also make sure that loggedIn user card should not be shown and those cards should not be shown whome req sent or received or rejected

userFunc.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.send({
      message: "Feed fetched successfully",
      users: users,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = userFunc;
