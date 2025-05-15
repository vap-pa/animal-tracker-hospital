import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Grid, CircularProgress, 
  useTheme, Avatar, Chip, Card, CardContent, CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Pets as PetsIcon,
  MedicalServices as MedicalServicesIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Emergency as EmergencyIcon,
} from '@mui/icons-material';
import {
  fetchAnimals,
  fetchAppointments,
  fetchMedicalRecords,
  fetchStaff,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

// Import images
import heroImage from '../assets/hero-animals.jpg';
import animalTrackingImg from '../assets/animal-tracking.jpg';
import medicalRecordsImg from '../assets/medical-records.jpg';
import appointmentsImg from '../assets/appointments.jpg';
import staffImg from '../assets/staff.jpg';

const StatisticCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(135deg, ${color}15, ${color}05)`,
    border: `1px solid ${color}30`,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
        <Typography variant="h6" sx={{ flex: 1 }}>{title}</Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: trend > 0 ? 'success.main' : 'error.main' }}>
            <TrendingUpIcon sx={{ transform: trend > 0 ? 'none' : 'rotate(180deg)' }} />
            <Typography variant="body2">{Math.abs(trend)}%</Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </CardContent>
  </Card>
);

const EmergencyCaseCard = ({ case: emergencyCase }) => (
  <Card sx={{ 
    mb: 2,
    backgroundColor: '#fff4f4',
    borderLeft: '4px solid #ff1744',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateX(4px)'
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#ff1744' }}>
          <EmergencyIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{emergencyCase.name} ({emergencyCase.type})</Typography>
          <Typography variant="body2" color="text.secondary">
            Under care of {emergencyCase.vet} - {emergencyCase.time}
          </Typography>
        </Box>
        <Chip 
          label={emergencyCase.condition}
          color="error"
          size="small"
        />
      </Box>
    </CardContent>
  </Card>
);

const FeatureCard = ({ icon, image, title, description, link, color }) => (
  <Card sx={{ 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6
    }
  }}>
    <CardMedia
      component="img"
      height="140"
      image={image}
      alt={title}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Button
        component={Link}
        to={link}
        variant="contained"
        sx={{ 
          backgroundColor: color,
          '&:hover': {
            backgroundColor: color,
            opacity: 0.9
          }
        }}
      >
        Learn More
      </Button>
    </CardContent>
  </Card>
);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          animals, 
          appointments, 
          medicalRecords, 
          staff
        ] = await Promise.all([
          fetchAnimals(),
          fetchAppointments({ status: 'Scheduled' }),
          fetchMedicalRecords(),
          fetchStaff({ active: true }),
        ]);

        // Calculate statistics
        const criticalCount = medicalRecords.filter(r => r.status === 'Critical').length;
        const observationCount = medicalRecords.filter(r => r.status === 'Under Observation').length;
        const healthyCount = animals.length - criticalCount - observationCount;
        const healthyPercentage = Math.round((healthyCount / animals.length) * 100);

        setStats({
          animals: animals.length,
          appointments: appointments.length,
          medicalRecords: medicalRecords.length,
          staff: staff.length,
          emergencyCases: appointments.filter(a => a.status === 'Emergency').length,
          healthyAnimals: healthyCount,
          underObservation: observationCount,
          criticalCases: criticalCount,
          healthyPercentage
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const features = [
    {
      icon: <PetsIcon fontSize="large" />,
      image: animalTrackingImg,
      title: 'Animal Tracking',
      description: 'Track all animals in our care with detailed profiles and health metrics.',
      link: '/animals',
      color: theme.palette.primary.main,
    },
    {
      icon: <MedicalServicesIcon fontSize="large" />,
      image: medicalRecordsImg,
      title: 'Medical Records',
      description: 'Comprehensive medical history, treatments, and vaccination records.',
      link: '/medical-records',
      color: theme.palette.secondary.main,
    },
    {
      icon: <ScheduleIcon fontSize="large" />,
      image: appointmentsImg,
      title: 'Appointments',
      description: 'Schedule, manage, and track veterinary appointments with reminders.',
      link: '/appointments',
      color: theme.palette.success.main,
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      image: staffImg,
      title: 'Staff Management',
      description: 'Manage veterinary staff, schedules, and responsibilities.',
      link: '/staff',
      color: theme.palette.warning.main,
    },
  ];

  const emergencyCases = [
    { id: 1, name: 'Max', type: 'Dog', condition: 'Critical', time: '2 hours ago', vet: 'Dr. Smith' },
    { id: 2, name: 'Luna', type: 'Cat', condition: 'Urgent', time: '1 hour ago', vet: 'Dr. Johnson' },
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
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          minHeight: 400,
          maxHeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              Welcome to Animal Tracker & Hospital
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              mb: 4, 
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}>
              Comprehensive care tracking for all your animals. Register or log in to get started!
            </Typography>
            <Button component={Link} to="/register" variant="contained" color="primary" size="large" sx={{ mr: 2 }}>
              Get Started
            </Button>
            <Button component={Link} to="/login" variant="outlined" color="inherit" size="large">
              Login
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>Why Choose Us?</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <PetsIcon color="primary" sx={{ fontSize: 48 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Expert Veterinary Care</Typography>
                <Typography variant="body2" color="text.secondary">Our team of experienced veterinarians ensures the best care for your pets.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <MedicalServicesIcon color="secondary" sx={{ fontSize: 48 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Comprehensive Records</Typography>
                <Typography variant="body2" color="text.secondary">Track medical history, appointments, and treatments all in one place.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <ScheduleIcon color="success" sx={{ fontSize: 48 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Easy Scheduling</Typography>
                <Typography variant="body2" color="text.secondary">Book and manage appointments with just a few clicks.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticCard
              title="Total Animals"
              value={stats?.animals ?? 0}
              icon={<PetsIcon />}
              color={theme.palette.primary.main}
              trend={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticCard
              title="Active Appointments"
              value={stats?.appointments ?? 0}
              icon={<ScheduleIcon />}
              color={theme.palette.success.main}
              trend={-2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticCard
              title="Medical Records"
              value={stats?.medicalRecords ?? 0}
              icon={<MedicalServicesIcon />}
              color={theme.palette.secondary.main}
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticCard
              title="Staff Members"
              value={stats?.staff ?? 0}
              icon={<PeopleIcon />}
              color={theme.palette.warning.main}
              trend={0}
            />
          </Grid>
        </Grid>
        {user && user.role === 'ROLE_ADMIN' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Admin Management Links</Typography>
            <Button component={Link} to="/animals" variant="contained" sx={{ mr: 2 }}>Manage Animals</Button>
            <Button component={Link} to="/appointments" variant="contained" sx={{ mr: 2 }}>Manage Appointments</Button>
            <Button component={Link} to="/medical-records" variant="contained" sx={{ mr: 2 }}>Manage Medical Records</Button>
            <Button component={Link} to="/staff" variant="contained">Manage Staff</Button>
          </Box>
        )}
        {user && user.role === 'ROLE_USER' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Your Animals</Typography>
            <Button component={Link} to="/animals" variant="contained">View Your Animals</Button>
          </Box>
        )}
      </Container>

      {/* Emergency Cases Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Emergency Cases
        </Typography>
        <Grid container spacing={3}>
          {emergencyCases.map((emergencyCase) => (
            <Grid item xs={12} md={6} key={emergencyCase.id}>
              <EmergencyCaseCard case={emergencyCase} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ bgcolor: '#222', color: '#fff', py: 4, mt: 8 }} component="footer">
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Animal Tracker & Hospital</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Your trusted partner in animal care and management.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2">Contact: info@animaltracker.com | +1 234 567 8901</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>© {new Date().getFullYear()} Animal Tracker & Hospital. All rights reserved.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;