// components/auth/LoginForm.js
import React, { useState } from 'react';
import AuthService from '../../utils/AuthService'; // Importa el AuthService
import { useUser } from '../../context/UserContext'; // Importa el hook del contexto
import '../../styles/AuthForm.css'; // Importa el archivo CSS para estilos

function LoginForm({ onLoginSuccess }) {
  const { setUser } = useUser(); // Obtén la función setUser del contexto
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
      const userData = await AuthService.login(loginData); // Usa AuthService para iniciar sesión
      setUser(userData); // Establece el usuario en el contexto
      
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error('Error durante el login:', error.response ? error.response.data : error.message);
      alert('Error durante el login: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
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
