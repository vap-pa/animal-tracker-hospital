import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
  
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import {
  fetchMedicalRecords,
  deleteMedicalRecord,
} from '../services/api';

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadMedicalRecords = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicalRecords();
        setMedicalRecords(data);
      } catch (error) {
        console.error('Failed to fetch medical records:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMedicalRecords();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMedicalRecord(id);
      setMedicalRecords(medicalRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error('Failed to delete medical record:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search records..."
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
  variant="contained"
  startIcon={<AddIcon />}
  component={Link}
  to="/medical-records/new"
>
  Add Record
</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Procedure</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Veterinarian</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Link to={`/animals/${record.animalId}`}>
                        {record.animalName || `Animal ${record.animalId}`}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.procedureType}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.veterinarianName || 'Unknown'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/medical-records/${record.id}`}
                        color="primary"
                      >
                        <MedicalServicesIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/medical-records/${record.id}/edit`}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDelete(record.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Add Medical Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Medical Record</DialogTitle>
        <DialogContent>
          {/* Form would go here */}
          <Typography>Medical record form would be implemented here</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Save Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecords;