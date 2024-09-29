// components/ProfilePage.js
import React from 'react';
import '../styles/Profile.css'; // Importa el archivo CSS para estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Íconos para usuario y correo
import { useUser } from '../context/UserContext'; // Importa el hook del contexto

const ProfilePage = () => {
  const { user } = useUser(); // Obtiene el usuario del contexto

  // Verifica si user no es null
  if (!user) {
    return (
      <div className="profile-page">
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  // Si user existe y es válido, renderiza la información del usuario
  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="profile-item">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <span className="profile-label">Username:</span>
          <span>{user.username}</span>
        </div>
        <div className="profile-item">
          <FontAwesomeIcon icon={faEnvelope} className="profile-icon" />
          <span className="profile-label">Email:</span>
          <span>{user.email}</span>
        </div>
        {/* Agrega más campos si necesitas */}
      </div>
    </div>
  );
};

export default ProfilePage;
