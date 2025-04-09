import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Grid, Paper, CircularProgress, 
  useTheme, Avatar, Divider, Chip, LinearProgress, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Pets as PetsIcon,
  MedicalServices as MedicalServicesIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Event as EventIcon,
  LocalHospital as HospitalIcon,
  Assignment as ReportIcon,
  BarChart as ChartIcon,
  Favorite as FavoriteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  fetchAnimals,
  fetchAppointments,
  fetchMedicalRecords,
  fetchStaff,
} from '../services/api';

// Import images
import heroImage from '../assets/hero-animals.jpg';
import animalTrackingImg from '../assets/animal-tracking.jpg';
import medicalRecordsImg from '../assets/medical-records.jpg';
import appointmentsImg from '../assets/appointments.jpg';
import staffImg from '../assets/staff.jpg';
import reportImg from '../assets/reports-analytics.jpg';
import emergencyImg from '../assets/emergency-cases.jpg';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [animalStatus, setAnimalStatus] = useState({
    healthy: 0,
    underObservation: 0,
    critical: 0,
    healthyPercentage: 0
  });
  const theme = useTheme();

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

        // Mock data for recent activities and tasks since these API endpoints don't exist
        const mockRecentActivities = [
          { type: 'Medical', description: 'Annual checkup for Max', time: '2 hours ago', animal: 'Max (Dog)' },
          { type: 'Appointment', description: 'Vaccination scheduled', time: '4 hours ago', animal: 'Bella (Cat)' },
          { type: 'Animal', description: 'New animal registered', time: '1 day ago', animal: 'Rocky (Rabbit)' },
        ];

        const mockUpcomingTasks = [
          { description: 'Follow-up for Luna', dueDate: 'Tomorrow', priority: 'Medium' },
          { description: 'Inventory check', dueDate: 'In 2 days', priority: 'Low' },
          { description: 'Monthly report', dueDate: 'End of week', priority: 'High' },
        ];

        // Calculate animal status based on medical records
        const criticalCount = medicalRecords.filter(r => r.status === 'Critical').length;
        const observationCount = medicalRecords.filter(r => r.status === 'Under Observation').length;
        const healthyCount = animals.length - criticalCount - observationCount;
        const healthyPercentage = Math.round((healthyCount / animals.length) * 100);

        setStats({
          animals: animals.length,
          appointments: appointments.length,
          medicalRecords: medicalRecords.length,
          staff: staff.length,
        });
        setRecentActivities(mockRecentActivities);
        setUpcomingTasks(mockUpcomingTasks);
        setAnimalStatus({
          healthy: healthyCount,
          underObservation: observationCount,
          critical: criticalCount,
          healthyPercentage
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
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
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Animal Care Management System
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Comprehensive care tracking for all your animals
            </Typography>
            {stats && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 4,
                flexWrap: 'wrap',
                mb: 4 
              }}>
                <StatBadge value={stats.animals} label="Animals" icon={<PetsIcon />} />
                <StatBadge value={stats.appointments} label="Appointments" icon={<ScheduleIcon />} />
                <StatBadge value={stats.medicalRecords} label="Records" icon={<MedicalServicesIcon />} />
                <StatBadge value={stats.staff} label="Staff" icon={<PeopleIcon />} />
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/animals"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View Animals
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/appointments"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  borderWidth: '2px',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderWidth: '2px',
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Schedule Appointment
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl">
        {/* Features Section */}
        <SectionHeader 
          title="Core Features" 
          subtitle="Everything you need to manage animal care"
          icon={<ChartIcon color="primary" />}
        />
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard 
                icon={feature.icon}
                image={feature.image}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                color={feature.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dashboard Overview */}
        <SectionHeader 
          title="Dashboard Overview" 
          subtitle="Quick insights and analytics"
          icon={<ChartIcon color="primary" />}
        />
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Animal Health Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={animalStatus.healthyPercentage || 0} 
                    color="success"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {`${animalStatus.healthyPercentage || 0}% Healthy`}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <StatusIndicator 
                    value={animalStatus.healthy || 0} 
                    label="Healthy" 
                    icon={<CheckCircleIcon color="success" />} 
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatusIndicator 
                    value={animalStatus.underObservation || 0} 
                    label="Observation" 
                    icon={<WarningIcon color="warning" />} 
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatusIndicator 
                    value={animalStatus.critical || 0} 
                    label="Critical" 
                    icon={<HospitalIcon color="error" />} 
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activities
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {recentActivities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              bgcolor: activity.type === 'Medical' ? theme.palette.secondary.light : 
                                      activity.type === 'Appointment' ? theme.palette.success.light : 
                                      theme.palette.primary.light,
                              mr: 2,
                              width: 32,
                              height: 32
                            }}>
                              {activity.type === 'Medical' ? <MedicalServicesIcon fontSize="small" /> :
                               activity.type === 'Appointment' ? <ScheduleIcon fontSize="small" /> :
                               <PetsIcon fontSize="small" />}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">{activity.description}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.time} • {activity.animal}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={activity.type} 
                            size="small"
                            sx={{ 
                              backgroundColor: activity.type === 'Medical' ? theme.palette.secondary.light : 
                                              activity.type === 'Appointment' ? theme.palette.success.light : 
                                              theme.palette.primary.light,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Emergency Cases
              </Typography>
              {emergencyCases.map((caseItem, index) => (
                <Box key={index} sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: '8px',
                  backgroundColor: caseItem.condition === 'Critical' ? 
                    theme.palette.error.light : theme.palette.warning.light
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {caseItem.name} • {caseItem.type}
                    </Typography>
                    <Chip 
                      label={caseItem.condition} 
                      size="small"
                      color={caseItem.condition === 'Critical' ? 'error' : 'warning'}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Assigned to: {caseItem.vet}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {caseItem.time}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Upcoming Tasks
              </Typography>
              {upcomingTasks.map((task, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.grey[200], 
                    mr: 2,
                    width: 32,
                    height: 32
                  }}>
                    <EventIcon fontSize="small" color="action" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">{task.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>
                  <Chip 
                    label={task.priority} 
                    size="small"
                    color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Reports & Analytics Section */}
        <SectionHeader 
          title="Reports & Analytics" 
          subtitle="Track performance and generate insights"
          icon={<ReportIcon color="primary" />}
        />
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Monthly Appointments
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <Box sx={{ 
                height: 300,
                backgroundImage: `url(${reportImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                mb: 2
              }} />
              <Typography variant="body2" color="text.secondary">
                Track appointment trends and staff workload over time
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Medical Cases Overview
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <Box sx={{ 
                height: 300,
                backgroundImage: `url(${emergencyImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                mb: 2
              }} />
              <Typography variant="body2" color="text.secondary">
                Common medical conditions and treatment statistics
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions Section */}
        <SectionHeader 
          title="Quick Actions" 
          subtitle="Get things done faster"
          icon={<FavoriteIcon color="primary" />}
        />
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard 
              title="Add New Animal"
              description="Register a new animal in the system"
              icon={<PetsIcon />}
              color={theme.palette.primary.main}
              link="/animals/new"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard 
              title="Create Appointment"
              description="Schedule a new veterinary visit"
              icon={<ScheduleIcon />}
              color={theme.palette.success.main}
              link="/appointments/new"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard 
              title="Add Medical Record"
              description="Document a treatment or procedure"
              icon={<MedicalServicesIcon />}
              color={theme.palette.secondary.main}
              link="/medical-records/new"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard 
              title="Generate Report"
              description="Create custom reports and exports"
              icon={<ReportIcon />}
              color={theme.palette.warning.main}
              link="/reports"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Reusable Components
const SectionHeader = ({ title, subtitle, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 4,
    '& svg': {
      mr: 2,
      fontSize: '2rem'
    }
  }}>
    {icon}
    <Box>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Box>
);

const StatBadge = ({ value, label, icon }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(5px)',
    borderRadius: '16px',
    padding: '16px 24px',
    minWidth: '120px',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {React.cloneElement(icon, { fontSize: 'medium' })}
      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
    <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
      {label}
    </Typography>
  </Box>
);

const FeatureCard = ({ icon, image, title, description, link, color }) => (
  <Paper elevation={3} sx={{ 
    height: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    }
  }}>
    <Box sx={{ 
      height: '140px',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, rgba(0,0,0,0.1), ${color}`,
        opacity: 0.7,
      }
    }}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
      }}>
        {React.cloneElement(icon, { sx: { fontSize: '3rem' } })}
      </Box>
    </Box>
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        {description}
      </Typography>
      <Button
        component={Link}
        to={link}
        variant="outlined"
        size="small"
        sx={{
          borderColor: color,
          color: color,
          '&:hover': {
            backgroundColor: color,
            color: 'white',
            borderColor: color,
          },
        }}
      >
        Explore
      </Button>
    </Box>
  </Paper>
);

const StatusIndicator = ({ value, label, icon }) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
      {icon}
      <Typography variant="body2" sx={{ ml: 1 }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

const QuickActionCard = ({ title, description, icon, color, link }) => (
  <Button
    component={Link}
    to={link}
    variant="contained"
    sx={{
      height: '100%',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      backgroundColor: color,
      color: 'white',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.03)',
        backgroundColor: color,
      }
    }}
  >
    {React.cloneElement(icon, { sx: { fontSize: '2.5rem', mb: 2 } })}
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2">
      {description}
    </Typography>
  </Button>
);

export default Home;