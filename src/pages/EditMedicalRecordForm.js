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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { fetchMedicalRecordById, updateMedicalRecord, fetchAnimals, fetchStaff } from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditMedicalRecordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    animalId: '',
    staffId: '',
    date: new Date(),
    procedureType: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: ''
  });

  // Fetch medical record data and required options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch medical record data
        const record = await fetchMedicalRecordById(id);
        
        // Fetch dropdown options
        const [animalsData, staffData] = await Promise.all([
          fetchAnimals(),
          fetchStaff()
        ]);
        
        setAnimals(animalsData);
        setStaff(staffData.filter(s => s.role === 'Veterinarian'));
        
        // Format the record data
        setFormData({
          animalId: record.animalId,
          staffId: record.staffId,
          date: new Date(record.date),
          procedureType: record.procedureType || '',
          diagnosis: record.diagnosis || '',
          treatment: record.treatment || '',
          medications: record.medications || '',
          notes: record.notes || ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load medical record');
        navigate('/medical-records');
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

  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      date: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicalRecord(id, {
        ...formData,
        date: formData.date.toISOString()
      });
      navigate('/medical-records');
    } catch (error) {
      console.error('Error updating medical record:', error);
      alert('Failed to update medical record. Please try again.');
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
        <Typography variant="h5" gutterBottom>Edit Medical Record</Typography>
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
            <DatePicker
              label="Record Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

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
              <MenuItem value="Diagnostic Test">Diagnostic Test</MenuItem>
              <MenuItem value="Emergency Treatment">Emergency Treatment</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
          />

          <TextField
            label="Medications"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

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
            <Button variant="outlined" onClick={() => navigate('/medical-records')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Record
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default EditMedicalRecordForm;