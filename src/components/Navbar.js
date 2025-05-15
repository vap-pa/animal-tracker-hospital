// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box, 
  Drawer, List, ListItem, ListItemText, Divider, Avatar,
  Menu, MenuItem, Tooltip
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    ...(user ? [{ label: 'Animals', to: '/animals' }] : []),
    ...(user ? [{ label: 'Appointments', to: '/appointments' }] : []),
    ...(user ? [{ label: 'Medical Records', to: '/medical-records' }] : []),
    ...(user && user.role === 'ROLE_ADMIN' ? [{ label: 'Staff', to: '/staff' }] : []),
    ...(user ? [{ label: 'Reports', to: '/reports' }] : []),
  ];

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <PetsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Animal Tracker & Hospital
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Button key={link.label} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
          
          {user ? (
            <>
              <Tooltip title={user.fullName || user.email}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {user.profilePicture ? (
                    <Avatar 
                      src={user.profilePicture} 
                      alt={user.fullName || user.email}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user.profilePicture ? (
                      <Avatar 
                        src={user.profilePicture} 
                        alt={user.fullName || user.email}
                        sx={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <AccountCircleIcon />
                    )}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {user.fullName || user.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Navigation */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
              {navLinks.map((link) => (
                <ListItem button key={link.label} component={Link} to={link.to}>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {user ? (
                <>
                  <ListItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.profilePicture ? (
                        <Avatar 
                          src={user.profilePicture} 
                          alt={user.fullName || user.email}
                          sx={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <AccountCircleIcon />
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {user.fullName || user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  <ListItem button onClick={() => navigate('/profile')}>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem button component={Link} to="/login">
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem button component={Link} to="/register">
                    <ListItemText primary="Register" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;