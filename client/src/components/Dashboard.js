import { Typography } from '@mui/material'
import Home from '../pages/Home'

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User data:', user);

  return (
    <>
      <Typography variant="h4" px={4}>Welcome, {user.name || 'User'}!</Typography>
      <Typography variant="body1" px={4}>Your are a Travel Mate <b>{user.role}</b> now!</Typography>
      <Home />
    </>
  );
};

export default Dashboard;

