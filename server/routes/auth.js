const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register (email/password)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email, provider: 'local' });
    if (user) return res.status(400).json({ msg: 'User already exists.' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role, provider: 'local' });
    await user.save();
    res.json({ msg: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// Login (email/password)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ msg: 'Server error.' });
    if (!user) return res.status(400).json({ msg: info.message });
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SESSION_SECRET, { expiresIn: '2d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  })(req, res, next);
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.SESSION_SECRET, { expiresIn: '2d' });
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  });

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.SESSION_SECRET, { expiresIn: '2d' });
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  });

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ msg: 'Logged out.' });
  });
});

module.exports = router;
//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// }));