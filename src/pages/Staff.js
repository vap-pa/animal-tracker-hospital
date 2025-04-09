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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import {
  fetchStaff,
  deactivateStaff,
} from '../services/api';

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filterRole) params.role = filterRole;
        const data = await fetchStaff(params);
        setStaffMembers(data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [filterRole]);

  const handleDeactivate = async (id) => {
    try {
      await deactivateStaff(id);
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    } catch (error) {
      console.error('Failed to deactivate staff:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Management
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search staff..."
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Veterinarian">Veterinarian</MenuItem>
                <MenuItem value="Veterinary Technician">Technician</MenuItem>
                <MenuItem value="Receptionist">Receptionist</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
  variant="contained"
  startIcon={<AddIcon />}
  component={Link}
  to="/staff/new"
>
  Add Staff
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
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        {staff.firstName} {staff.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.specialization}</TableCell>
                    <TableCell>
                      <Box>
                        <div>{staff.email}</div>
                        <div>{staff.phone}</div>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(staff.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/staff/${staff.id}/edit`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeactivate(staff.id)}
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

      {/* Add Staff Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogContent>
          {/* Form would go here */}
          <Typography>Staff form would be implemented here</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Add Staff
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Staff;