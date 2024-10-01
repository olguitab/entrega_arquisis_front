// components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Asegúrate de importar el contexto

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser(); // Obtiene el estado del usuario y el estado de carga del contexto

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se verifica la autenticación
  }

  if (!user) {
    return <Navigate to="/users" />; // Redirige a la página de login si no está autenticado
  }

  return children; // Si está autenticado, renderiza los hijos
};

export default ProtectedRoute;
