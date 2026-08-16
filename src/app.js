const express = require("express");
const connectDB = require("../config/dataBase.js");
const User = require("./models/user.model.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cp = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middleware/userAuth.js");

const app = express();

app.use(express.json());
app.use(cp());

// this is our sign up API to create a new user
app.post("/singup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
  } = req.body;

  try {
    // First Name
    if (!firstName) {
      throw new Error("First name is required");
    }

    if (typeof firstName !== "string") {
      throw new Error("First name must be a string");
    }

    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
      throw new Error("First name must be between 2 and 50 characters");
    }

    // Last Name
    if (!lastName) {
      throw new Error("Last name is required");
    }

    if (typeof lastName !== "string") {
      throw new Error("Last name must be a string");
    }

    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
      throw new Error("Last name must be between 2 and 50 characters");
    }

    // Email
    if (!emailId) {
      throw new Error("Email is required");
    }

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }

    // Password
    if (!password) {
      throw new Error("Password is required");
    }

    if (typeof password !== "string") {
      throw new Error("Password must be a string");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    }

    // Age
    if (age === undefined || age === null) {
      throw new Error("Age is required");
    }

    if (typeof age !== "number") {
      throw new Error("Age must be a number");
    }

    if (age < 18 || age > 100) {
      throw new Error("Age must be between 18 and 100");
    }

    // Gender
    if (!gender) {
      throw new Error("Gender is required");
    }

    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      throw new Error("Invalid gender");
    }

    // Photo URL
    if (photoUrl && !validator.isURL(photoUrl)) {
      throw new Error("Invalid photo URL");
    }

    // About
    if (about) {
      if (typeof about !== "string") {
        throw new Error("About must be a string");
      }

      if (about.trim().length > 500) {
        throw new Error("About cannot exceed 500 characters");
      }
    }

    // Skills
    if (skills) {
      if (!Array.isArray(skills)) {
        throw new Error("Skills must be an array");
      }

      if (skills.length > 20) {
        throw new Error("Maximum 20 skills are allowed");
      }
    }

    // hash password

    const hashPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    res.status(201).send({
      message: "Signup successful",
      data: newUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// this is our loggin API to logging a user succefully

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const foundUser = await User.findOne({ emailId: emailId });

    if (!foundUser) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      throw new Error("Password is not correct");
    }

    // here JWT is creating

    const token = await jwt.sign({ _id: foundUser._id }, "CaptanAmerica");
    console.log(token);

    res.cookie("token", token);

    res.status(200).json({
      msg: "User logged in successfully",
      data: foundUser,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
});

// testing profile access using cookies

app.get("/profile", userAuth, async (req, res) => {
 
const user = req.user

  res.send({
    message: "user found using token",
    data: user,
  });
});

// this api is to get the single user info

app.get("/user", async (req, res) => {
  const email = req.body.emailId;

  try {
    const foundUser = await User.find({ emailId: email });
    res.send({
      message: "user found succefully",
      data: foundUser,
    });
  } catch (error) {
    res.send("somthig went wrong");
  }
});

// this is feed api to get all the data of database

app.get("/feed", async (req, res) => {
  const foundData = await User.find({});

  res.send({
    msg: "Data fetch succefully",
    data: foundData,
  });
});

// thi api is for to update any specific data

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const newUser = req.body;

  const updateUser = await User.findByIdAndUpdate(id, newUser);

  res.send({
    msg: "User Updated Succefully",
    data: updateUser,
  });
});

// this api is to delete a user

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  const findUser = await User.findByIdAndDelete(id);

  res.send({
    msg: "user deleted succefully",
    data: findUser,
  });
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
