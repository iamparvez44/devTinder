const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://parvezdata44_db_user:TC8r03ps8PnNOmFQ@cluster0.fjnmvyq.mongodb.net/devTinder"
  );
};

module.exports = connectDB;