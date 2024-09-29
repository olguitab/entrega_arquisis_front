// utils/AuthService.js
import { registerUser, loginUser, setAuthHeader } from './api'; // Importa las funciones de api
import api from './api'; // Importa la instancia de axios desde api.js


const AuthService = {
  register: async (registerData) => {
    return await registerUser(registerData);
  },
  
  login: async (loginData) => {
    const response = await loginUser(loginData);
    const accessToken = response.data.accessToken;

    // Almacena el token y configura el encabezado
    localStorage.setItem('userToken', accessToken);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    setAuthHeader();

    return response.data; // Devuelve los datos del usuario
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default AuthService;
