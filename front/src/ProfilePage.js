import React from 'react';

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
    // Aquí podrías manejar el error, por ejemplo, limpiando el almacenamiento local si está corrupto
    // localStorage.removeItem('userInfo');
  }

  // Verifica si userInfo no es null
  if (!userInfo) {
    return <div>No has iniciado sesión o la información del usuario no está disponible.</div>;
  }

  // Si userInfo existe y es válido, renderiza la información del usuario
  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Username: {userInfo.username}</p>
      <p>Email: {userInfo.email}</p>
      {/* Agrega más campos si necesitas */}
    </div>
  );
};

export default ProfilePage;