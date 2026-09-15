const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

connectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check if fromUserId is equal toUserId

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send connetion request to yourself");
  }
  next()
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionSchema,
);

module.exports = ConnectionRequestModel;
