import React, { useState, useEffect } from 'react';
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createAppointment } from '../services/api';
import { fetchAnimals } from '../services/api';
import { fetchStaff } from '../services/api';

const AddAppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    animalId: '',
    dateTime: new Date(),
    type: 'Checkup',
    description: '',
    status: 'Scheduled',
    veterinarianId: ''
  });
  const [animals, setAnimals] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [animalsData, staffData] = await Promise.all([
          fetchAnimals(),
          fetchStaff({ role: 'Veterinarian' })
        ]);
        setAnimals(animalsData);
        setStaff(staffData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      dateTime: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAppointment({
        ...formData,
        dateTime: formData.dateTime.toISOString()
      });
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
        <Typography variant="h5" gutterBottom>Schedule New Appointment</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Animal</InputLabel>
            <Select
              name="animalId"
              value={formData.animalId}
              onChange={handleChange}
              label="Animal"
            >
              {animals.map(animal => (
                <MenuItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <DateTimePicker
              label="Date & Time"
              value={formData.dateTime}
              onChange={handleDateTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Appointment Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Appointment Type"
            >
              <MenuItem value="Checkup">Checkup</MenuItem>
              <MenuItem value="Vaccination">Vaccination</MenuItem>
              <MenuItem value="Surgery">Surgery</MenuItem>
              <MenuItem value="Dental">Dental</MenuItem>
              <MenuItem value="Follow-up">Follow-up</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Veterinarian</InputLabel>
            <Select
              name="veterinarianId"
              value={formData.veterinarianId}
              onChange={handleChange}
              label="Veterinarian"
            >
              {staff.map(staffMember => (
                <MenuItem key={staffMember.id} value={staffMember.id}>
                  {staffMember.firstName} {staffMember.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/appointments')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Schedule Appointment
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default AddAppointmentForm;