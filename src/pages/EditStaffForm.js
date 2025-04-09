import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import { fetchStaffById, updateStaff } from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PersonIcon from '@mui/icons-material/Person';

const EditStaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Veterinarian',
    specialization: '',
    hireDate: new Date(),
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isActive: true
  });

  // Fetch staff data when component mounts
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const staff = await fetchStaffById(id);
        
        // Format dates for date inputs (YYYY-MM-DD)
        const formattedData = {
          ...staff,
          hireDate: new Date(staff.hireDate)
        };
        
        setFormData(formattedData);
      } catch (error) {
        console.error('Error fetching staff:', error);
        alert('Failed to load staff data');
        navigate('/staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      hireDate: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStaff(id, {
        ...formData,
        hireDate: formData.hireDate.toISOString()
      });
      navigate('/staff');
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Failed to update staff. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Typography variant="h5" gutterBottom>Edit Staff Member</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6">
              {formData.firstName} {formData.lastName}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Veterinarian">Veterinarian</MenuItem>
                  <MenuItem value="Veterinary Technician">Veterinary Technician</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                  <MenuItem value="Administrator">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, mb: 2 }}>
            <DatePicker
              label="Hire Date"
              value={formData.hireDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="isActive"
              value={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
              label="Status"
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/staff')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Staff
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default EditStaffForm;