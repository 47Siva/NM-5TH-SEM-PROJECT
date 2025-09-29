const bcrypt = require("bcryptjs");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { generateAccessToken, getRefreshExpiryDate } = require("../utils/jwt");
const crypto = require("crypto");

// 👉 Register Controller
exports.register = async (req, res) => {
  try {
    console.log("Request body:", req.body); // <-- check data coming from form
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Save user
    const newUser = new User({ username, email, password});
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 👉 Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = require('crypto').randomBytes(64).toString('hex');
    const expiryDate = getRefreshExpiryDate();

    // Save refresh token
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiryDate });

    res.json({ msg: "Login successful", accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 👉 Refresh Token
exports.refresh = async (req, res) => {
  res.json({ msg: "Refresh token not implemented yet" });
};

// 👉 Logout
exports.logout = async (req, res) => {
  res.json({ msg: "Logout not implemented yet" });
};
