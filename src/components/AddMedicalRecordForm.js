import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { createMedicalRecord } from '../services/api';
import { fetchAnimals } from '../services/api';
import { fetchStaff } from '../services/api';

const AddMedicalRecordForm = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    animalId: animalId || '',
    date: new Date().toISOString().split('T')[0],
    procedureType: 'Checkup',
    diagnosis: '',
    treatment: '',
    notes: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord(formData);
      if (animalId) {
        navigate(`/animals/${animalId}`);
      } else {
        navigate('/medical-records');
      }
    } catch (error) {
      console.error('Error creating medical record:', error);
      alert('Failed to create medical record. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        {animalId ? 'Add Medical Record' : 'Create New Medical Record'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {!animalId && (
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
        )}

        <TextField
          label="Date"
          name="date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Procedure Type</InputLabel>
          <Select
            name="procedureType"
            value={formData.procedureType}
            onChange={handleChange}
            label="Procedure Type"
          >
            <MenuItem value="Checkup">Checkup</MenuItem>
            <MenuItem value="Vaccination">Vaccination</MenuItem>
            <MenuItem value="Surgery">Surgery</MenuItem>
            <MenuItem value="Dental">Dental</MenuItem>
            <MenuItem value="Diagnostic">Diagnostic</MenuItem>
            <MenuItem value="Treatment">Treatment</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          required
        />

        <TextField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />

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
          <Button variant="outlined" onClick={() => animalId ? navigate(`/animals/${animalId}`) : navigate('/medical-records')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Record
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddMedicalRecordForm;