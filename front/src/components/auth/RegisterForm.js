// components/auth/RegisterForm.js
import React, { useState } from 'react';
import AuthService from '../../utils/AuthService'; // Importa el AuthService
import '../../styles/AuthForm.css'; // Importa el archivo CSS para estilos

function RegisterForm({ onSuccess }) {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(registerData);
      console.log('Registro exitoso', response.data);
      alert('Registro exitoso!');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error durante el registro:', error.response ? error.response.data : error.message);
      alert('Error durante el registro: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={registerData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;
