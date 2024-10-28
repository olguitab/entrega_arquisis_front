// utils/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://f4lua74a2m.execute-api.us-east-1.amazonaws.com', // Cambia esto a tu URL base
  baseURL: 'http://localhost:3001',
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
    const response = await api.get('/fixtures?count=100');
    return response.data.data;
  };

export const getFixture = async (fixtureId) => {
  const response = await api.get(`/fixtures/${fixtureId}`);
  console.log('Trying to get fixture with id:', fixtureId);
  console.log('Fixture:', response.data.data);
  return response.data.data;
}

// Exporta las funciones para manejar las peticiones
export const registerUser = async (registerData) => {
  return await api.post('/users', registerData);
};

export const loginUser = async (loginData) => {
  return await api.post('/users/login', loginData);
};

// Nueva función para comprar bonos
export const purchaseBond = async (betDetails) => {
  console.log('Sending request to purchase bond', betDetails, 'Rute:', '/api/bet');
  console.log('Starting the payment process');
  const amount = betDetails.quantity * 1000;
  if (betDetails.wallet){
    const userId = betDetails.id_usuario;
    await payWithWallet(userId, amount);
    return await api.post('/api/bet', betDetails);
  }
  else{
    const betId = betDetails.request_id
    const response =  await payWithWebpay(betId, amount);
    betDetails.deposit_token = response.savedTransaction.token;
    const createdBet = await api.post('/api/bet', betDetails);
    return {url: response.url, token: response.savedTransaction.token, transactionId: response.savedTransaction._id, createdBet};
  };
};

export const payWithWallet = async (userId, amount) => {
  try {
    await api.put(`/wallet/update/${userId}`, {amount: -amount});
    console.log('Paying with the users wallet');
  } catch (error) {
    console.error('Error paying with the users wallet:', error);
    throw new Error('Error updating wallet: ' + error.message);
  }
};

export const payWithWebpay = async (betId, amount) => {
  try{
    const transactionData = {
      betId,
      amount
    };
    const response = await api.post(`/transactions`, transactionData);
    console.log('Paying with webpay. Creating the transaction...');
    return response.data;
  }
  catch (error){
    console.log(`Error paying with webpay: ${error}`);
    throw new Error('Error paying with webpay: ' + error.message);
  }
};

export const commitTransaction = async (token_ws, transactionId) => {
  try {
      const response = await api.post(`/transactions/commit`, {
          token_ws,
          transactionId,
      });
      console.log(`Response from commit: ${response.data}`)
      return response.data; // Devuelve la respuesta de la API
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al hacer commit');
  }
};

export const getUserBalance = async (user_id) => {
  console.log('Sending request to get user balance', user_id);
  const response = await api.get(`/wallet/balance/${user_id}`);
  return response.data; 
};


export const getTransactionHistory = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data.transactions;
};

export const addFundsToWallet = async (userId, amount) => {
  const response = await api.post(`/wallet/add-money`, { user_id: userId, amount });
  return response.data; // Puede que no devuelvas nada, pero puedes ajustar esto según sea necesario
};


export const getBetHistory = async (userId) => {
  try {
    const response = await api.get(`/api/bet/history/${userId}`); // Usa la ruta correcta
    return response.data;
  } catch (error) {
    console.error('Error fetching bet history', error);
    throw error;
  }
};

export const getTotalBondsAvailable = async (fixture_id) => {
  try {
    const response = await api.get(`/available-bonds/${fixture_id}`);
    console.log(`Available Bonds for the fixture: ${response.data} `)
    return response.data;
  } catch (error) {
    return "Error fetching total bonds available";
  }
};



export { setAuthHeader }; // Exporta la función para configurar el token
