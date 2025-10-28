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
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Update login statistics
    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLogin = new Date();
    await user.save();
    console.log(`User ${user.email} login updated - Count: ${user.loginCount}, Last Login: ${user.lastLogin}`);

    // Generate access token
    const accessToken = generateAccessToken(user);

    // Check if user already has a refresh token (not revoked)
    let existingToken = await RefreshToken.findOne({ 
      userId: user._id,
      revoked: false 
    });
    console.log("Checking existing refresh token for user:", user._id);
    console.log("Existing token:", existingToken);

    let refreshToken;
    if (existingToken) {
      if (existingToken.expiryDate > new Date()) {
        // Token exists & still valid → reuse it
        refreshToken = existingToken.token;
      } else {
        // Token expired → delete old token & create new one
        await RefreshToken.deleteOne({ _id: existingToken._id });
        refreshToken = crypto.randomBytes(64).toString("hex");
        const expiryDate = getRefreshExpiryDate();
        await RefreshToken.create({ token: refreshToken, userId: user._id, expiryDate });
      }
    } else {
      // No token exists → create new
      refreshToken = crypto.randomBytes(64).toString("hex");
      const expiryDate = getRefreshExpiryDate();
      await RefreshToken.create({ token: refreshToken, userId: user._id, expiryDate });
    }

    res.json({ msg: "Login successful", accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// 👉 Refresh Token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token required" });
    }

    // Find the refresh token in database
    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken, 
      revoked: false 
    }).populate('userId');

    if (!tokenDoc) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    // Check if token is expired
    if (tokenDoc.expiryDate < new Date()) {
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(403).json({ msg: "Refresh token expired" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(tokenDoc.userId);

    res.json({ 
      msg: "Token refreshed successfully", 
      accessToken: newAccessToken 
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 👉 Logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token required" });
    }

    // Revoke the refresh token
    const result = await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { revoked: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Refresh token not found" });
    }

    res.json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 👉 Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(`Profile requested for ${user.email} - Login Count: ${user.loginCount}, Last Login: ${user.lastLogin}`);
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 👉 Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ 
      msg: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
