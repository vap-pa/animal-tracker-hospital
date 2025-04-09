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
  Chip,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  fetchAnimals,
  deleteAnimal,
} from '../services/api';

const statusColors = {
  Healthy: 'success',
  Recovering: 'warning',
  'In Treatment': 'error',
  'Chronic Condition': 'info',
};

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        const data = await fetchAnimals(searchParams);
        setAnimals(data);
      } catch (error) {
        console.error('Failed to fetch animals:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnimals();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm) {
      if (searchTerm.match(/^[a-zA-Z]+$/)) {
        params.name = searchTerm;
      } else {
        params.ownerName = searchTerm;
      }
    }
    setSearchParams(params);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnimal(id);
      setAnimals(animals.filter(animal => animal.id !== id));
    } catch (error) {
      console.error('Failed to delete animal:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Animal Management
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by name or owner..."
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ ml: 1 }}>
              Search
            </Button>
          </form>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/animals/new"
          >
            Add Animal
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
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell>{animal.name}</TableCell>
                    <TableCell>{animal.type}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.age} years</TableCell>
                    <TableCell>
                      <Chip
                        label={animal.status}
                        color={statusColors[animal.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{animal.ownerName}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/animals/${animal.id}`}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/animals/${animal.id}/edit`}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Animals;