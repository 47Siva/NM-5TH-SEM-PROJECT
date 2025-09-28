const jwt = require('jsonwebtoken');

const ACCESS_EXPIRES = '15m';   // 15 minutes
const REFRESH_EXPIRES_DAYS = 7; // 7 days

// Access token generate
const generateAccessToken = (user) => {
  const payload = { id: user._id, username: user.username, roles: user.roles };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
};

// Refresh token expiry date
const getRefreshExpiryDate = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_EXPIRES_DAYS);
  return expiry;
};

module.exports = { generateAccessToken, getRefreshExpiryDate };
