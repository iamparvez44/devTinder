require("dotenv").config();
const express = require("express");
const connectDB = require("../config/dataBase.js");
const User = require("./models/user.model.js");
const cp = require("cookie-parser");
const { userAuth } = require("./middleware/userAuth.js");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cp());

// routes

const userRoutes = require("../src/routes/userRoutes.js");
const profileRoutes = require("../src/routes/profile.js");
const connectionRoutes = require("../src/routes/connectionRequest.js");
const userFunc = require("./routes/user.js");

app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", connectionRoutes);
app.use("/", userFunc);

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
    console.log("DataBase Connected Succefully");
  })
  .catch((error) => {
    console.log("Unable to connect DB", error);
  });
