import FlightLandIcon from '@mui/icons-material/FlightLand'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <FlightLandIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            Travel Mate
          </Typography>
        </Box>
        {user?.role && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* <Button color="inherit" component={RouterLink} to="/trip">
              Trip
            </Button>
            <Button color="inherit" component={RouterLink} to="/admin">
              Admin
            </Button> */}
            <Button color="secondary" onClick={handleLogout}>
              <LogoutIcon />
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;