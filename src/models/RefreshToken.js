const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create index on expiryDate for efficient queries
refreshTokenSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
