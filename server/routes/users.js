const express = require('express');
const { auth, permit } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
  res.json({ msg: 'Profile updated.', user });
});

// Get all users (admin only)
router.get('/', auth, permit('Admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete user (admin only)
router.delete('/:id', auth, permit('Admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted.' });
});

module.exports = router;
