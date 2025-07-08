const express = require('express');
const { auth, permit } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// View usage reports (stub, can be expanded)
router.get('/usage', auth, permit('Admin'), async (req, res) => {
  const users = await User.countDocuments();
  res.json({ users, msg: 'Usage report.' });
});

// Update user roles
router.put('/user/:id/role', auth, permit('Admin'), async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ msg: 'User role updated successfully.' });
});

// Deactivate/Delete user
router.delete('/user/:id', auth, permit('Admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User account deleted.' });
});

module.exports = router;
// This admin route allows administrators to view usage reports, update user roles, and delete user accounts.
// The usage report is a simple count of users and trips, but can be expanded to include more detailed analytics.
// The user role update and deletion endpoints allow for management of user accounts, ensuring that administrators can maintain control over the platform's user base.
// The `auth` middleware ensures that only authenticated users can access these routes, while the `permit` middleware restricts access to users with the 'Admin' role.
// This structure provides a solid foundation for administrative functionalities in the application.