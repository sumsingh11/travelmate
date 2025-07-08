const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for email/password
  role: { type: String, enum: ['Traveller', 'Admin'], default: 'Traveller' },
  provider: { type: String, default: 'local' }, // local
  googleId: String,
  facebookId: String,
  avatar: String,
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
