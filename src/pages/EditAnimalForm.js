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
} from '@mui/material';
import { fetchAnimalById, updateAnimal } from '../services/api';

const EditAnimalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    status: 'Healthy',
    weight: '',
    microchipNumber: '',
    birthDate: '',
    admissionDate: '',
    ownerName: '',
    ownerContact: ''
  });

  // Fetch animal data when component mounts
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        setLoading(true);
        const animal = await fetchAnimalById(id);
        
        // Format dates for date inputs (YYYY-MM-DD)
        const formattedData = {
          ...animal,
          birthDate: animal.birthDate?.split('T')[0] || '',
          admissionDate: animal.admissionDate?.split('T')[0] || ''
        };
        
        setFormData(formattedData);
      } catch (error) {
        console.error('Error fetching animal:', error);
        alert('Failed to load animal data');
        navigate('/animals');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [id, navigate]);

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
      await updateAnimal(id, formData);
      navigate('/animals');
    } catch (error) {
      console.error('Error updating animal:', error);
      alert('Failed to update animal. Please try again.');
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Animal</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
          >
            <MenuItem value="Dog">Dog</MenuItem>
            <MenuItem value="Cat">Cat</MenuItem>
            <MenuItem value="Bird">Bird</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Other fields same as before */}
        <TextField
          label="Breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Healthy">Healthy</MenuItem>
            <MenuItem value="Recovering">Recovering</MenuItem>
            <MenuItem value="In Treatment">In Treatment</MenuItem>
            <MenuItem value="Chronic Condition">Chronic Condition</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Microchip Number"
          name="microchipNumber"
          value={formData.microchipNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Birth Date"
          name="birthDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.birthDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Admission Date"
          name="admissionDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.admissionDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Owner Name"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Owner Contact"
          name="ownerContact"
          value={formData.ownerContact}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/animals')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Update Animal
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditAnimalForm;