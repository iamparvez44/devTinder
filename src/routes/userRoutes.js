const express = require("express")
const authRoutes = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middleware/userAuth.js")

// this is our sign up API to create a new user
authRoutes.post("/signup", async (req, res) => {
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

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).send({
      message: "Signup successful",
      data: userData,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});


// this is our loggin API to logging a user succefully
authRoutes.post("/login", async (req, res) => {
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

    const token = await jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const userData = foundUser.toObject();
    delete userData.password;

    res.status(200).json({
      msg: "User logged in successfully",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
});

//this api is to loggout the the user

authRoutes.get("/logout",userAuth, (req, res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }).send({
    msg: "User loggout succefully",
    data: (() => {
      const userData = req.user.toObject();
      delete userData.password;
      return userData;
    })()
  })
})

module.exports = authRoutes


