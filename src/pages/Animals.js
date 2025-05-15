import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  useTheme,
  Button,
  MenuItem,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import {
  fetchAnimals,
  deleteAnimal,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Healthy: 'success',
  Recovering: 'warning',
  'In Treatment': 'error',
  'Chronic Condition': 'info',
};

const AnimalCard = ({ animal, onDelete, showOwner }) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getDefaultImage = (type) => {
    if (!type) return 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80'; // generic animal
    const typeMap = {
      Dog: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      Cat: 'https://images.unsplash.com/photo-1518715308788-249b62e17b36?auto=format&fit=crop&w=400&q=80',
      Bird: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      Rabbit: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      Other: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    };
    return typeMap[type] || typeMap['Other'];
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(animal.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete animal:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (!animal) return null;

  return (
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
        image={animal.imageUrl || getDefaultImage(animal.type)}
        alt={animal.name || 'Animal'}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            mr: 2
          }}>
            <PetsIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{animal.name || 'Unnamed Animal'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {animal.breed || 'Unknown Breed'} • {animal.age || 'Unknown'} years
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={animal.type || 'Unknown Type'}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={animal.status || 'Unknown Status'}
            color={statusColors[animal.status] || 'default'}
            size="small"
          />
          {showOwner && (
            <Chip 
              label={animal.ownerName || 'Unknown Owner'}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            component={Link}
            to={`/animals/${animal.id}`}
            color="primary"
            size="small"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={handleDeleteClick}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Animal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {animal.name || 'this animal'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const Animals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    birthDate: '',
    status: '',
    weight: '',
    microchipNumber: '',
    ownerName: '',
    ownerContact: ''
  });

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnimals(searchParams);
        setAnimals(Array.isArray(data) ? data : []);
        
        // If we have an ID in the URL, find and select that animal
        if (id) {
          const animal = data.find(a => a.id === parseInt(id));
          if (animal) {
            setSelectedAnimal(animal);
            setFormData({
              name: animal.name || '',
              type: animal.type || '',
              breed: animal.breed || '',
              birthDate: animal.birthDate?.split('T')[0] || '',
              status: animal.status || '',
              weight: animal.weight || '',
              microchipNumber: animal.microchipNumber || '',
              ownerName: animal.ownerName || '',
              ownerContact: animal.ownerContact || ''
            });
            setEditDialogOpen(true);
          } else {
            setError('Animal not found');
            navigate('/animals');
          }
        }
      } catch (error) {
        console.error('Failed to fetch animals:', error);
        setError('Failed to load animals. Please try again later.');
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };
    loadAnimals();
  }, [searchParams, id, navigate]);

  const handleFilter = () => {
    setPage(1);
    const params = {};
    if (searchTerm) {
      if (searchTerm.match(/^[a-zA-Z]+$/)) {
        params.name = searchTerm;
      } else {
        params.ownerName = searchTerm;
      }
    }
    if (typeFilter) params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    setSearchParams(params);
  };

  const paginatedAnimals = animals.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(animals.length / pageSize);

  const handleDelete = async (id) => {
    try {
      await deleteAnimal(id);
      setAnimals(animals.filter(animal => animal.id !== id));
    } catch (error) {
      console.error('Failed to delete animal:', error);
      setError('Failed to delete animal. Please try again.');
    }
  };

  const handleEditClick = (animal) => {
    setSelectedAnimal(animal);
    setFormData({
      name: animal.name || '',
      type: animal.type || '',
      breed: animal.breed || '',
      birthDate: animal.birthDate?.split('T')[0] || '',
      status: animal.status || '',
      weight: animal.weight || '',
      microchipNumber: animal.microchipNumber || '',
      ownerName: animal.ownerName || '',
      ownerContact: animal.ownerContact || ''
    });
    setEditDialogOpen(true);
    // Update URL when opening dialog
    navigate(`/animals/${animal.id}/edit`);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedAnimal(null);
    setFormData({
      name: '',
      type: '',
      breed: '',
      birthDate: '',
      status: '',
      weight: '',
      microchipNumber: '',
      ownerName: '',
      ownerContact: ''
    });
    // Clear URL when closing dialog
    navigate('/animals');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/animals/${selectedAnimal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update animal');
      }

      const updatedAnimal = await response.json();
      setAnimals(animals.map(animal => 
        animal.id === selectedAnimal.id ? updatedAnimal : animal
      ));
      handleEditClose();
    } catch (error) {
      console.error('Failed to update animal:', error);
      setError('Failed to update animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user && user.role === 'ROLE_ADMIN' ? 'All Animals' : 'Your Animals'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            placeholder="Search by name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          />
          <TextField
            select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            SelectProps={{ native: true }}
          >
            <option value="">All Types</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </TextField>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            SelectProps={{ native: true }}
          >
            <option value="">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Recovering">Recovering</option>
            <option value="In Treatment">In Treatment</option>
            <option value="Chronic Condition">Chronic Condition</option>
          </TextField>
          <Button variant="contained" onClick={handleFilter} sx={{ minWidth: 120 }}>Filter</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : animals.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>No animals found</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <AnimalCard animal={animal} onDelete={handleDelete} showOwner={user && user.role === 'ROLE_ADMIN'} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1} sx={{ mr: 2 }}>Previous</Button>
        <Typography sx={{ mt: 1 }}>{page} / {totalPages || 1}</Typography>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages || totalPages === 0} sx={{ ml: 2 }}>Next</Button>
      </Box>

      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditClose} 
        maxWidth="sm" 
        fullWidth
        // Prevent closing by clicking outside when accessed via URL
        disableBackdropClick={!!id}
      >
        <DialogTitle>
          {selectedAnimal ? `Edit ${selectedAnimal.name}` : 'Edit Animal'}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box p={3}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Cat">Cat</MenuItem>
                    <MenuItem value="Bird">Bird</MenuItem>
                    <MenuItem value="Rabbit">Rabbit</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Healthy">Healthy</MenuItem>
                    <MenuItem value="Recovering">Recovering</MenuItem>
                    <MenuItem value="In Treatment">In Treatment</MenuItem>
                    <MenuItem value="Chronic Condition">Chronic Condition</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Microchip Number"
                    name="microchipNumber"
                    value={formData.microchipNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Contact"
                    name="ownerContact"
                    value={formData.ownerContact}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button onClick={handleEditClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Animals;