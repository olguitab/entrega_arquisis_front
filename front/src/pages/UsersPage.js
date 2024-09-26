// pages/UsersPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';
import '../styles/AuthForm.css'; // Importa el CSS para el estilo de la página

function UsersPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Estado para controlar qué formulario se muestra

  const handleRegisterSuccess = () => {
    setIsLogin(true); // Regresar a la vista de inicio de sesión después de un registro exitoso
  };

  const handleLoginSuccess = () => {
    navigate('/profile');
  };

  return (
    <div className="users-page">
      <div className="slider">
        <button className={`slider-button ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
          Iniciar Sesión
        </button>
        <button className={`slider-button ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
          Registrarse
        </button>
      </div>
      <div className="form-container">
        {isLogin ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </div>
    </div>
  );
}

export default UsersPage;
