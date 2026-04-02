// backend/src/routes/auth.js
import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js"; // your existing middleware

const router = express.Router();

// ====================== SIGNUP ======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // role optional

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (password hashed automatically in User.js)
    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
});

// ====================== LOGIN ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
});

// ====================== GET CURRENT USER ======================
// Protected route example
router.get("/me", auth, async (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;