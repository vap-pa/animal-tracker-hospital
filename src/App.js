import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Animals from './pages/Animals';
import AnimalDetail from './pages/AnimalDetail';
import EditAnimalForm from './pages/EditAnimalForm';
import EditAppointmentForm from './pages/EditAppointmentForm';
import EditMedicalRecordForm from './pages/EditMedicalRecordForm';
import EditStaffForm from './pages/EditStaffForm';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import MedicalRecordDetail from './pages/MedicalRecordDetail';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AddAnimalForm from './components/AddAnimalForm';
import AddAppointmentForm from './components/AddAppointmentForm';
import AddMedicalRecordForm from './components/AddMedicalRecordForm';
import AddStaffForm from './components/AddStaffForm';
import Profile from './components/Profile';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/animals"
                    element={
                      <ProtectedRoute>
                        <Animals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/new"
                    element={
                      <ProtectedRoute>
                        <AddAnimalForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/:id"
                    element={
                      <ProtectedRoute>
                        <AnimalDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditAnimalForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/:id/medical/add"
                    element={
                      <ProtectedRoute>
                        <AddMedicalRecordForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute>
                        <Appointments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/appointments/new"
                    element={
                      <ProtectedRoute>
                        <AddAppointmentForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/appointments/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditAppointmentForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/medical-records"
                    element={
                      <ProtectedRoute>
                        <MedicalRecords />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/medical-records/:id"
                    element={
                      <ProtectedRoute>
                        <MedicalRecordDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/medical-records/new"
                    element={
                      <ProtectedRoute>
                        <AddMedicalRecordForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/medical-records/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditMedicalRecordForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Staff />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/new"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AddStaffForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/:id/edit"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <EditStaffForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
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