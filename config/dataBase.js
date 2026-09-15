const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connectDB;