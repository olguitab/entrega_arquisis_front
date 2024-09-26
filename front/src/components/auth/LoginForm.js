// components/auth/LoginForm.js
import React, { useState } from 'react';
import { loginUser, setAuthHeader } from '../../utils/api'; // Importa la función de login
import '../../styles/AuthForm.css'; // Importa el archivo CSS para estilos

function LoginForm({ onLoginSuccess }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      console.log('Login exitoso', response.data);
      
      const accessToken = response.data.accessToken;
      localStorage.setItem('userToken', accessToken);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      alert('Login exitoso!');
      
      setAuthHeader();
      
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error('Error durante el login:', error.response ? error.response.data : error.message);
      alert('Error durante el login: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="auth-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
