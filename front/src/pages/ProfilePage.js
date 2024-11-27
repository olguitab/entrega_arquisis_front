import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faDollarSign, faCog } from '@fortawesome/free-solid-svg-icons';
import { faWallet, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';  // Cambiar a useNavigate

import Modal from '../components/layout/Modal';
import AddFunds from '../components/wallet/AddFundsForm';
import TransactionHistory from '../components/wallet/TransactionHistoryForm';
import { getUserBalance, getTransactionHistory, addFundsToWallet } from '../utils/api';

const ProfilePage = () => {
  const { user, loading } = useUser();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (user && user._id) {
          const userBalance = await getUserBalance(user._id);
          setBalance(userBalance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setFetchError(true);
      }
    };

    if (!loading) {
      fetchBalance();
    }
  }, [user, loading]);

  const handleAddFunds = async (amount) => {
    try {
      await addFundsToWallet(user._id, amount);
      const updatedBalance = await getUserBalance(user._id);
      setBalance(updatedBalance);
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleGoToAdminPanel = () => {
    navigate('/admin-panel'); // Usamos navigate para redirigir a la página del panel de administración
  };

  const historyContent = transactions.length > 0 ? (
    transactions.map((transaction, index) => (
      <div key={index}>
        <p>{transaction.description} - ${transaction.amount}</p>
      </div>
    ))
  ) : (
    <p>No transactions found or failed to fetch transactions.</p>
  );

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      {/* Información del usuario */}
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
        <hr className="separator" />

        {/* Información del Wallet */}
        <div className="profile-item">
          <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
          <span className="profile-label">Wallet:</span>
          <div className="wallet-section">
            <div className="wallet-buttons">
              <button className="wallet-button" onClick={() => setAddFundsOpen(true)}>Add Funds</button>
            </div>
          </div>
        </div>
        <div className="profile-item">
          <FontAwesomeIcon icon={faMoneyBillWave} className="wallet-icon" />
          <span className="profile-label">Balance:</span>
          {fetchError || loading ? (
            <span className="failed-text">Failed to fetch balance</span>
          ) : (
            <span className="money">${balance !== null ? balance : 'Loading...'}</span>
          )}
        </div>

        {/* Mostrar sección de administración solo si el username es admin@uc.cl */}
        {user.email === 'admin@uc.cl' && (
          <div>
            <hr className="separator" />
            <div className="profile-item">
              <FontAwesomeIcon icon={faCog} className="wallet-icon" />
              <span className="profile-label">Admin:</span>
              <div className="wallet-section">
                <div className="wallet-buttons">
                  <button className="wallet-button" onClick={handleGoToAdminPanel}>Panel</button>
                </div>
              </div>
            </div>
          </div>

        )}
      </div>

      {/* Modal para añadir fondos */}
      <Modal isOpen={isAddFundsOpen} onClose={() => setAddFundsOpen(false)}>
        <AddFunds onClose={() => setAddFundsOpen(false)} onAddFunds={handleAddFunds} />
      </Modal>
    </div>
  );
};

export default ProfilePage;
