// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Cambia esto a tu URL base
});
export default api;


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

// Nueva función para comprar bonos
export const purchaseBond = async (fixtureId, amount, selectedOdd) => {
  const data = {
    fixtureId,
    amount,
    selectedOdd,
  };
  return await api.post('/bonds/purchase', data); // Cambia '/bonds/purchase' a la ruta correcta de tu API
};

export const getUserBalance = async () => {
  const response = await api.get('/wallet/balance');
  return response.data.balance;
};

export const getTransactionHistory = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data.transactions;
};

export const addFundsToWallet = async (amount) => {
  const response = await api.post('/wallet/add-funds', { amount });
  return response.data;
};



export { setAuthHeader }; // Exporta la función para configurar el token
