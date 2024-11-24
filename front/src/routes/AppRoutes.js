// routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FixturesPage from '../pages/UpcomingFixturesPage';
import UsersPage from '../pages/UsersPage';
import ProfilePage from '../pages/ProfilePage';
import PastFixturesPage from '../pages/PastFixturesPage';
import ProtectedRoute from '../components/auth/ProtectedRoute'; 
import BetHistoryPage from '../pages/BetHistoryPage'; 
import RecommendationsPage from '../pages/RecommendationsPage';
// <Route path="/confirmed" element={<ConfirmedBetPage />} />
import SuccessfulPurchasePage from '../pages/SuccessfulPurchasePage'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fixtures" element={<FixturesPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/past-fixtures" element={<PastFixturesPage />} />
      <Route path="/successful-purchase" element={<SuccessfulPurchasePage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bet-history" 
        element={
          <ProtectedRoute>
            <BetHistoryPage/>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recommendations" 
        element={
          <ProtectedRoute>
            <RecommendationsPage/>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
