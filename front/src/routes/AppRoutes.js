// routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FixturesPage from '../pages/FixturesPage';
import UsersPage from '../pages/UsersPage';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoute from '../components/auth/ProtectedRoute'; // Importa el componente ProtectedRoute

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/fixtures" element={<FixturesPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
