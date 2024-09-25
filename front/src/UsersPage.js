import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
  const navigate = useNavigate();  
  // Estado para el formulario de registro
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Estado para el formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Manejadores de cambio para los formularios
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para enviar los datos de registro al backend con axios
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/users', registerData);
      console.log('Registro exitoso', response.data);
      alert('Registro exitoso!'); // Alerta de éxito
      // Aquí podrías redirigir al usuario o limpiar el formulario
    } catch (error) {
      console.error('Error durante el registro:', error.response ? error.response.data : error.message);
      alert('Error durante el registro: ' + (error.response ? error.response.data.message : error.message)); // Alerta de error
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/users/login', loginData);
      console.log('Login exitoso', response.data);
      const accessToken = response.data.accessToken; // Guarda el accessToken desde la respuesta
      localStorage.setItem('userToken', accessToken); // Guarda el accessToken en localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data)); // Guarda directamente la respuesta
      alert('Login exitoso!');
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // Usa directamente accessToken
      navigate('/profile');
    } catch (error) {
      console.error('Error durante el login:', error.response ? error.response.data : error.message);
      alert('Error durante el login: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div>
      {/* Formulario de registro */}
      <form onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          name="username"
          value={registerData.username}
          onChange={handleRegisterChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={registerData.email}
          onChange={handleRegisterChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleRegisterChange}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Formulario de login */}
      <form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleLoginChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default UsersPage;