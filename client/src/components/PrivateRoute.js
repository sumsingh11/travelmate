import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" />;

  // If a specific role is required and user does not match, redirect accordingly
  if (role && user.role !== role) {
    if (user.role === 'Admin') return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;