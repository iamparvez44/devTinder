const mongoose = require("mongoose");



const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    
    
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
     
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Invalid gender",
      },
      lowercase: true,
      trim: true,
    },

    photoUrl: {
      type: String,
      trim: true,
      maxlength: [500, "Photo URL is too long"],
      match: [
        /^https?:\/\/.+/,
        "Photo URL must be a valid URL",
      ],
    },

    about: {
      type: String,
      trim: true,
      maxlength: [500, "About cannot exceed 500 characters"],
    },

    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills) {
          return skills.length <= 20;
        },
        message: "You can add maximum 20 skills",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model("User", userSchema);