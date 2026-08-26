const express = require("express");
const { userAuth } = require("../middleware/userAuth.js");
const profileRoutes = express.Router();
const { validateEditProfileData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

// this api is to get the data of a perticular user
profileRoutes.get("/profile/view", userAuth, (req, res) => {
  const user = req.user;

  try {
    res.send({
      msg: "User fetch succefully",
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
});

// this api is to edit the profile of a perticular user

profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    loggedInUser.firstName = req.body.firstName;
    loggedInUser.lastName = req.body.lastName;
    loggedInUser.age = req.body.age;
    loggedInUser.photoUrl = req.body.photoUrl;
    loggedInUser.about = req.body.about;
    loggedInUser.skills = req.body.skills;

    await loggedInUser.save();

    res.status(200).json({
      message: "User Edit succefully",
      user: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// this api will change my passwrod

profileRoutes.patch("/profile/password/change", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { oldPassword, newPassword } = req.body;

    // old password
    if (!oldPassword) {
      throw new Error("OLD Password is required");
    }

    if (typeof oldPassword !== "string") {
      throw new Error("invelid credetials");
    }

    // new password

    if (!newPassword) {
      throw new Error("New Password is required");
    }

    if (typeof newPassword !== "string") {
      throw new Error("New Password require");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("NEW Password is not strong enough");
    }

    const isoldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      loggedInUser.password,
    );

    if (!isoldPasswordCorrect) {
      throw new Error("Old password is not correct");
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newHashPassword;
    await loggedInUser.save();

    res.status(200).send({
      msg: "password save succefully",
      data: loggedInUser,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = profileRoutes;

// $2b$10$AkBPlC6KSRd8UQ632zAhkuNg4nIXLORLW2MEjB./ZwIBcOPuoxUam
