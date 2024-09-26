import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FixturesPage from '../pages/FixturesPage';
import UsersPage from '../pages/UsersPage';
import ProfilePage from '../pages/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/fixtures" element={<FixturesPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
