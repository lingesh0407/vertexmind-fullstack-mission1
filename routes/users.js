const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    console.log("Register Request:", req.body);
    console.log("MongoDB State:", mongoose.connection.readyState);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    console.log("Login Request:", req.body);
    console.log("MongoDB State:", mongoose.connection.readyState);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= PROTECTED PROFILE =================
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected Route Accessed Successfully",
    user: req.user,
  });
});

// ================= GET ALL USERS =================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET USER BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= UPDATE USER =================
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;