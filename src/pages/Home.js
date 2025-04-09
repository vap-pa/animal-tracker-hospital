import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import {
  fetchAnimals,
  fetchAppointments,
  fetchMedicalRecords,
  fetchStaff,
} from '../services/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [animals, appointments, medicalRecords, staff] = await Promise.all([
          fetchAnimals(),
          fetchAppointments({ status: 'Scheduled' }),
          fetchMedicalRecords(),
          fetchStaff({ active: true }),
        ]);

        setStats({
          animals: animals.length,
          appointments: appointments.length,
          medicalRecords: medicalRecords.length,
          staff: staff.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const features = [
    {
      icon: <PetsIcon fontSize="large" />,
      title: 'Animal Tracking',
      description: 'Track all animals in our care with detailed profiles.',
      link: '/animals',
    },
    {
      icon: <MedicalServicesIcon fontSize="large" />,
      title: 'Medical Records',
      description: 'Comprehensive medical history for each animal.',
      link: '/medical-records',
    },
    {
      icon: <ScheduleIcon fontSize="large" />,
      title: 'Appointments',
      description: 'Schedule and manage veterinary appointments.',
      link: '/appointments',
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'Staff Management',
      description: 'Manage veterinary staff and their schedules.',
      link: '/staff',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Animal Tracker & Hospital
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Comprehensive care for all your animals
        </Typography>
        {stats && (
          <Typography variant="subtitle1" gutterBottom>
            Currently tracking {stats.animals} animals, with {stats.appointments} upcoming appointments
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/animals"
          sx={{ mt: 3 }}
        >
          View Animals
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {React.cloneElement(feature.icon, { color: 'primary' })}
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              <Button
                component={Link}
                to={feature.link}
                variant="outlined"
                size="small"
              >
                Learn More
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;