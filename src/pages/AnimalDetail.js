import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

import {
  fetchAnimalById,
  fetchMedicalRecordsByAnimalId,
} from '../services/api';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const animalData = await fetchAnimalById(id);
        const recordsData = await fetchMedicalRecordsByAnimalId(id);
        setAnimal(animalData);
        setMedicalRecords(recordsData);
      } catch (err) {
        setError(err.message);
        navigate('/animals', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/animals"
          sx={{ mb: 2 }}
        >
          Back to Animals
        </Button>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}>
                  <PetsIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h4" component="h2" gutterBottom>
                  {animal.name}
                </Typography>
                <Chip
                  label={animal.status}
                  color={
                    animal.status === 'Healthy'
                      ? 'success'
                      : animal.status === 'Recovering'
                      ? 'warning'
                      : 'error'
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={Link}
                  to={`/animals/${animal.id}/edit`}
                  sx={{ mb: 3 }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Type" secondary={animal.type} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Breed" secondary={animal.breed} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Age" secondary={`${animal.age} years`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Weight" secondary={`${animal.weight} kg`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Microchip" secondary={animal.microchipNumber} />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Owner Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Owner" secondary={animal.ownerName} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Contact" secondary={animal.ownerContact} />
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Hospital Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Admission Date" secondary={new Date(animal.admissionDate).toLocaleDateString()} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Medical History
          </Typography>
          {medicalRecords.length > 0 ? (
            <List>
              {medicalRecords.map((record, index) => (
                <React.Fragment key={record.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MedicalInformationIcon color="primary" sx={{ mr: 1 }} />
                          {record.procedureType}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                          <span>Diagnosis: {record.diagnosis}</span>
                          <span>Treatment: {record.treatment}</span>
                          {record.notes && <span>Notes: {record.notes}</span>}
                          {record.veterinarianName && (
                            <span>Veterinarian: {record.veterinarianName}</span>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < medicalRecords.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No medical records found for this animal.
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            component={Link}
            to={`/animals/${animal.id}/medical/add`}
          >
            Add Medical Record
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default AnimalDetail;