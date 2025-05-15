import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fetchMedicalRecord } from '../services/api';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecord = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicalRecord(id);
        setRecord(data);
      } catch (err) {
        console.error('Error loading medical record:', err);
        setError('Failed to load medical record. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id]);

  const handleEdit = () => {
    navigate(`/medical-records/${id}/edit`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/medical-records')}
        >
          Back to Records
        </Button>
      </Container>
    );
  }

  if (!record) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Medical record not found
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/medical-records')}
        >
          Back to Records
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/medical-records')}
        >
          Back to Records
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          Edit Record
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Record Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Animal Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Animal Name:</strong> {record.animalName}
              </Typography>
              <Typography variant="body1">
                <strong>Species:</strong> {record.animalType}
              </Typography>
              <Typography variant="body1">
                <strong>Breed:</strong> {record.animalBreed}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Record Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Record ID:</strong> {record.id}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <Chip
                  label={record.status}
                  color={
                    record.status === 'Critical'
                      ? 'error'
                      : record.status === 'Under Observation'
                      ? 'warning'
                      : 'success'
                  }
                  size="small"
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Diagnosis
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">{record.diagnosis}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Treatment
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">{record.treatment}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Notes
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">{record.notes}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Veterinarian
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {record.veterinarianName}
              </Typography>
              <Typography variant="body1">
                <strong>Contact:</strong> {record.veterinarianContact}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MedicalRecordDetail; 