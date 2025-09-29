const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // optional
  lastLogin: { type: Date },
  isOnline: { type: Boolean, default: false }, // <-- track currently logged in
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
