import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { createStaff } from '../services/api';

const AddStaffForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'Veterinarian',
    email: '',
    phone: '',
    specialization: '',
    hireDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStaff(formData);
      navigate('/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
      alert('Failed to create staff member. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>Add New Staff Member</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
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
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Hire Date"
          name="hireDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.hireDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/staff')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Staff
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddStaffForm;