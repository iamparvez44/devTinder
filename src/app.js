const express = require("express");
const connectDB = require("../config/dataBase.js");
const User = require("./models/user.model.js");
const cp = require("cookie-parser");
const { userAuth } = require("./middleware/userAuth.js");
const app = express();
app.use(express.json());
app.use(cp());

// routes

const userRoutes = require("../src/routes/userRoutes.js")
const profileRoutes = require("../src/routes/profile.js")
const connectionRoutes = require("../src/routes/connection.js")

app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", connectionRoutes);


connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running on 3000");
    });
    console.log("DataBase Connected Succefully");
  })
  .catch((error) => {
    console.log("Unable to connect DB", error);
  });
