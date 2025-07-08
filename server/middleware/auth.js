const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied.' });

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token invalid.' });
  }
}

function permit(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden.' });
    }
    next();
  };
}

module.exports = { auth, permit };
// This middleware checks for a valid JWT token in the Authorization header.
// If the token is valid, it decodes the user information and attaches it to the request object.
// The `permit` function checks if the user has one of the allowed roles before proceeding with the request.
// This is useful for protecting routes that require specific user roles, such as 'Admin' or 'Organizer'.
// The middleware can be used in your routes like this:
// const { auth, permit } = require('../middleware/auth');
// router.get('/admin', auth, permit('Admin'), (req, res) => {
//   res.json({ msg: 'Welcome Admin!' });
// });