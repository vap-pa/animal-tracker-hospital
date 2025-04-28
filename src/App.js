import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Animals from './pages/Animals';
import AnimalDetail from './pages/AnimalDetail';
import EditAnimalForm from './pages/EditAnimalForm';
import EditAppointmentForm from './pages/EditAppointmentForm';
import EditMedicalRecordForm from './pages/EditMedicalRecordForm';
import EditStaffForm from './pages/EditStaffForm';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AddAnimalForm from './components/AddAnimalForm';
import AddAppointmentForm from './components/AddAppointmentForm';
import AddMedicalRecordForm from './components/AddMedicalRecordForm';
import AddStaffForm from './components/AddStaffForm';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/animals" element={<Animals />} />
                  <Route path="/animals/new" element={<AddAnimalForm />} />
                  <Route path="/animals/:id" element={<AnimalDetail />} />
                  <Route path="/animals/edit/:id" element={<EditAnimalForm />} />
                  <Route path="/animals/:id/medical/add" element={<AddMedicalRecordForm />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/appointments/new" element={<AddAppointmentForm />} />
                  <Route path="/appointments/:id/edit" element={<EditAppointmentForm />} />
                  <Route path="/medical-records" element={<MedicalRecords />} />
                  <Route path="/medical-records/new" element={<AddMedicalRecordForm />} />
                  <Route path="/medical-records/:id/edit" element={<EditMedicalRecordForm />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/staff/new" element={<AddStaffForm />} />
                  <Route path="/staff/:id/edit" element={<EditStaffForm />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;