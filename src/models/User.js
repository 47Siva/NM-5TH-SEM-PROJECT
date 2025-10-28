const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles:    { type: [String], default: ['USER'] },
  loginCount: { type: Number, default: 0 },
  lastLogin: { type: Date, default: null },
  createdAt:{ type: Date, default: Date.now }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

// Password hash before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
