import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5006/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const Input = styled('input')({
  display: 'none',
});

const Profile = () => {
  const { accessToken, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phoneNumber: '',
    address: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        setMessage({ type: 'error', text: 'Please log in to view your profile' });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUserData(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          username: response.data.username || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to load profile data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/me`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUserData(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/me/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUserData(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }));
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload profile picture'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Please log in to view your profile
          </Alert>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={userData?.profilePicture}
              alt={userData?.fullName || userData?.email}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {!userData?.profilePicture && <AccountCircleIcon sx={{ fontSize: 60 }} />}
            </Avatar>
            <label htmlFor="profile-picture-upload">
              <Input
                accept="image/*"
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureUpload}
                disabled={isLoading}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
                disabled={isLoading}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {userData?.fullName || userData?.email}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {userData?.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: userData.fullName || '',
                      email: userData.email || '',
                      username: userData.username || '',
                      phoneNumber: userData.phoneNumber || '',
                      address: userData.address || '',
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </form>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1">
                {userData?.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Account Type
              </Typography>
              <Typography variant="body1">
                {userData?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Standard User'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body1">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body1">
                {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Profile; 