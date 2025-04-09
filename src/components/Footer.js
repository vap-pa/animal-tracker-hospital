// src/components/Footer.js
import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'© '}
        <MuiLink component={Link} to="/" color="inherit">
          Animal Tracker & Hospital
        </MuiLink>{' '}
        {new Date().getFullYear()}
        {'. '}
        <MuiLink href="#" color="inherit">
          Privacy Policy
        </MuiLink>{' '}
        |{' '}
        <MuiLink href="#" color="inherit">
          Terms of Service
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;