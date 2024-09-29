// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Asegúrate de importar el contexto

const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // Obtiene el estado del usuario del contexto

  if (!user) {
    return <Navigate to="/users" />; // Redirige a la página de login si no está autenticado
  }

  return children; // Si está autenticado, renderiza los hijos
};

export default ProtectedRoute;
