// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Cambia esto a tu URL base
});

// Configuración para incluir el token en las cabeceras si existe
const setAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const getFixtures = async () => {
    const response = await api.get('/fixtures');
    return response.data.data;
  };

// Exporta las funciones para manejar las peticiones
export const registerUser = async (registerData) => {
  return await api.post('/users', registerData);
};

export const loginUser = async (loginData) => {
  return await api.post('/users/login', loginData);
};

export { setAuthHeader }; // Exporta la función para configurar el token
