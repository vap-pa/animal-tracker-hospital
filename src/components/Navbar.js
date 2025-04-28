// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    ...(user ? [{ label: 'Animals', to: '/animals' }] : []),
    ...(user ? [{ label: 'Appointments', to: '/appointments' }] : []),
    ...(user ? [{ label: 'Medical Records', to: '/medical-records' }] : []),
    ...(user && user.role === 'ROLE_ADMIN' ? [{ label: 'Staff', to: '/staff' }] : []),
    ...(user ? [{ label: 'Reports', to: '/reports' }] : []),
  ];

  const authLinks = !user
    ? [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' },
      ]
    : [{ label: 'Logout', action: handleLogout }];

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
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navLinks.map((link) => (
            <Button key={link.label} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
          {authLinks.map((link) =>
            link.action ? (
              <Button key={link.label} color="inherit" onClick={link.action}>
                {link.label}
              </Button>
            ) : (
              <Button key={link.label} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            )
          )}
        </Box>
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
              {navLinks.map((link) => (
                <ListItem button key={link.label} component={Link} to={link.to}>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {authLinks.map((link) =>
                link.action ? (
                  <ListItem button key={link.label} onClick={link.action}>
                    <ListItemText primary={link.label} />
                  </ListItem>
                ) : (
                  <ListItem button key={link.label} component={Link} to={link.to}>
                    <ListItemText primary={link.label} />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;