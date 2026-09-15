const express = require("express");
const { userAuth } = require("../middleware/userAuth.js");
const connectionRoutes = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.model.js");

// this api is to send conncetion request to another user
connectionRoutes.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // checking status value
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invelied status type" + status });
      }

      //here we are finding that toUser i.e. the user to whome i am sendting the request is existing in our data base or not

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({
          message: "User not exist",
        });
      }

      // checking if friend request is already send or not

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already sent");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "conncetion request send successfully!!",
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR" + error.message);
    }
  },
);

// this api is to review the connection request, here is decide that requiest could be accepted or rejected

connectionRoutes.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not allowed" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request Not Found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection Request" + status, data });
    } catch (error) {
      res.status(400).send("ERROR" + error.message);
    }
  },
);

module.exports = connectionRoutes;
