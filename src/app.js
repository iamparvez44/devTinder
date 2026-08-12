const express = require("express");
const connectDB = require("../config/dataBase.js");
const User = require("./models/user.model.js");

const app = express();

app.use(express.json());

// this is post api to create new user
app.post("/singup", (req, res) => {
  // console.log(req.body)
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.send("User saved succefully");
    })
    .catch((error) => {
      res.send("somthing went wrong");
    });
});

// this api is to get the single user info

app.get("/user", async (req, res) => {
  const email = req.body.emailId;

  try {

    const foundUser = await User.find({ emailId: email }); 
    res.send({
      message: "user found succefully",
      data: foundUser
    })
    
  } catch (error) {

    res.send("somthig went wrong");
    
  }

  
});

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
