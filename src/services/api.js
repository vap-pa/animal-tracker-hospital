import axios from 'axios';

const API_BASE_URL = 'http://localhost:5006/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Animals API
export const fetchAnimals = async (params = {}) => {
  try {
    const response = await api.get('/animals', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }
};

export const fetchAnimalById = async (id) => {
  try {
    const response = await api.get(`/animals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching animal:', error);
    throw error;
  }
};

export const createAnimal = async (animalData) => {
  try {
    const response = await api.post('/animals', animalData);
    return response.data;
  } catch (error) {
    console.error('Error creating animal:', error);
    throw error;
  }
};

export const updateAnimal = async (id, animalData) => {
  try {
    const response = await api.put(`/animals/${id}`, animalData);
    return response.data;
  } catch (error) {
    console.error('Error updating animal:', error);
    throw error;
  }
};

export const deleteAnimal = async (id) => {
  try {
    await api.delete(`/animals/${id}`);
  } catch (error) {
    console.error('Error deleting animal:', error);
    throw error;
  }
};

// Appointments API
export const fetchAppointments = async (params = {}) => {
  try {
    const response = await api.get('/appointments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchAppointmentById = async (id) => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    await api.delete(`/appointments/${id}`);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Medical Records API
export const fetchMedicalRecords = async (params = {}) => {
  try {
    const response = await api.get('/medical-records', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
};

export const fetchMedicalRecordsByAnimalId = async (animalId) => {
  try {
    const response = await api.get(`/medical-records/animal/${animalId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
};

export const createMedicalRecord = async (recordData) => {
  try {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

export const updateMedicalRecord = async (id, recordData) => {
  try {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
};

export const deleteMedicalRecord = async (id) => {
  try {
    await api.delete(`/medical-records/${id}`);
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
};

// Staff API
export const fetchStaff = async (params = {}) => {
  try {
    const response = await api.get('/staff', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

export const fetchStaffById = async (id) => {
  try {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff member:', error);
    throw error;
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await api.post('/staff', staffData);
    return response.data;
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

export const updateStaff = async (id, staffData) => {
  try {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  } catch (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
};

export const deactivateStaff = async (id) => {
  try {
    await api.delete(`/staff/${id}`);
  } catch (error) {
    console.error('Error deactivating staff member:', error);
    throw error;
  }
};