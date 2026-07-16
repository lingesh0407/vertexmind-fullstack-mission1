console.log("Users route loaded");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE USER
router.post("/", async (req, res) => {
  try {

    console.log("Received Data:", req.body);

    const user = new User(req.body);

    const savedUser = await user.save();

    res.status(201).json(savedUser);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// READ ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ ONE USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(404).json({ message: "Invalid user ID" });
  }
});


// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});


// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
});


module.exports = router;