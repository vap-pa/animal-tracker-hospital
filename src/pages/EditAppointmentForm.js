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
  CircularProgress
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle
} from '@mui/material';
import { fetchAppointmentById, updateAppointment, fetchAnimals, fetchStaff } from '../services/api';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditAppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    animalId: '',
    staffId: '',
    dateTime: new Date(),
    type: 'Checkup',
    status: 'Scheduled',
    notes: ''
  });

  // Fetch appointment data and required options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch appointment data
        const appointment = await fetchAppointmentById(id);
        
        // Fetch dropdown options
        const [animalsData, staffData] = await Promise.all([
          fetchAnimals(),
          fetchStaff()
        ]);
        
        setAnimals(animalsData);
        setStaff(staffData.filter(s => s.role === 'Veterinarian'));
        
        // Format the appointment data
        setFormData({
          animalId: appointment.animalId,
          staffId: appointment.staffId,
          dateTime: new Date(appointment.dateTime),
          type: appointment.type,
          status: appointment.status,
          notes: appointment.notes || ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load appointment data');
        navigate('/appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
      await updateAppointment(id, {
        ...formData,
        dateTime: formData.dateTime.toISOString()
      });
      navigate('/appointments');
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment. Please try again.');
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
        <Typography variant="h5" gutterBottom>Edit Appointment</Typography>
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
                  {animal.name} ({animal.breed})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Veterinarian</InputLabel>
            <Select
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              label="Veterinarian"
            >
              {staff.map(person => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name} ({person.specialization || 'General'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, mb: 2 }}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={formData.dateTime}
              onChange={handleDateTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="Checkup">Checkup</MenuItem>
              <MenuItem value="Vaccination">Vaccination</MenuItem>
              <MenuItem value="Surgery">Surgery</MenuItem>
              <MenuItem value="Dental">Dental</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
          </FormControl>

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

          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/appointments')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Appointment
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default EditAppointmentForm;