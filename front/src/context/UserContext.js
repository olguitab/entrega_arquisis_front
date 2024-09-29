// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Almacenar la información del usuario desde el almacenamiento local
  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      setUser(JSON.parse(userInfoString));
    }
  }, []);

  // Función de cierre de sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  return useContext(UserContext);
};
