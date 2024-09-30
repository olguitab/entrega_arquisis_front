// routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FixturesPage from '../pages/UpcomingFixturesPage';
import UsersPage from '../pages/UsersPage';
import ProfilePage from '../pages/ProfilePage';
import PastFixturesPage from '../pages/PastFixturesPage';
import ProtectedRoute from '../components/auth/ProtectedRoute'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/fixtures" element={<FixturesPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/past-fixtures" element={<PastFixturesPage />} />
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
