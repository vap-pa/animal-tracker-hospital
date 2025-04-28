import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import EventIcon from '@mui/icons-material/Event';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import {
  fetchAnimals,
  fetchAppointments,
  fetchMedicalRecords,
  fetchStaff,
} from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [timeRange, setTimeRange] = useState('year');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    animals: 0,
    appointments: 0,
    procedures: 0,
    staff: 0,
  });
  const [animalTypesData, setAnimalTypesData] = useState(null);
  const [monthlyAppointmentsData, setMonthlyAppointmentsData] = useState(null);
  const [procedureTypesData, setProcedureTypesData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data needed for reports
        const [animals, appointments, medicalRecords, staff] = await Promise.all([
          fetchAnimals(),
          fetchAppointments(),
          fetchMedicalRecords(),
          fetchStaff(),
        ]);

        // Calculate basic stats
        setStats({
          animals: animals.length,
          appointments: appointments.length,
          procedures: medicalRecords.length,
          staff: staff.length,
        });

        // Prepare animal types chart data
        const animalTypesCount = animals.reduce((acc, animal) => {
          acc[animal.type] = (acc[animal.type] || 0) + 1;
          return acc;
        }, {});

        setAnimalTypesData({
          labels: Object.keys(animalTypesCount),
          datasets: [
            {
              label: 'Number of Animals',
              data: Object.values(animalTypesCount),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Prepare monthly appointments data (simplified)
        const monthlyAppointments = Array(12).fill(0);
        appointments.forEach(appt => {
          const month = new Date(appt.dateTime).getMonth();
          monthlyAppointments[month]++;
        });

        setMonthlyAppointmentsData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Appointments',
              data: monthlyAppointments,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Prepare procedure types data
        const procedureTypesCount = medicalRecords.reduce((acc, record) => {
          acc[record.procedureType] = (acc[record.procedureType] || 0) + 1;
          return acc;
        }, {});

        setProcedureTypesData({
          labels: Object.keys(procedureTypesCount),
          datasets: [
            {
              label: 'Procedures',
              data: Object.values(procedureTypesCount),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error('Failed to load report data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [reportType, timeRange]);

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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="monthly">Monthly Overview</MenuItem>
                <MenuItem value="animals">Animal Statistics</MenuItem>
                <MenuItem value="procedures">Procedure Analysis</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button variant="contained" color="primary">
            Export Report
          </Button>
        </Box>

        <Grid container spacing={3}>
          {animalTypesData && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Animal Types Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={animalTypesData} />
                </Box>
              </Paper>
            </Grid>
          )}

          {monthlyAppointmentsData && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Appointments
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={monthlyAppointmentsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {procedureTypesData && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Procedure Types
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={procedureTypesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <EventIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.appointments}</Typography>
              <Typography variant="subtitle1">Appointments</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <PetsIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats?.animals ?? 0}</Typography>
              <Typography variant="subtitle1">Animals in Care</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <MedicalServicesIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.procedures}</Typography>
              <Typography variant="subtitle1">Procedures</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.staff}</Typography>
              <Typography variant="subtitle1">Staff Members</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Reports;