import React from 'react';
import '../styles/Profile.css'; // Importa el archivo CSS para estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Íconos para usuario y correo

const ProfilePage = () => {
  let userInfo = null;

  // Intenta obtener y parsear la información del usuario desde el almacenamiento local
  try {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      userInfo = JSON.parse(userInfoString);
    }
  } catch (error) {
    console.error('Error al parsear la información del usuario:', error);
  }

  // Verifica si userInfo no es null
  if (!userInfo) {
    return (
      <div className="profile-page">
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  // Si userInfo existe y es válido, renderiza la información del usuario
  return (
    <div className="profile-page">
      <h2>Perfil de Usuario</h2>
      <div className="profile-card">
        <div className="profile-item">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <span className="profile-label">Username:</span>
          <span>{userInfo.username}</span>
        </div>
        <div className="profile-item">
          <FontAwesomeIcon icon={faEnvelope} className="profile-icon" />
          <span className="profile-label">Email:</span>
          <span>{userInfo.email}</span>
        </div>
        {/* Agrega más campos si necesitas */}
      </div>
    </div>
  );
};

export default ProfilePage;
