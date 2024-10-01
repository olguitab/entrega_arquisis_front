// components/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import '../styles/Profile.css'; // Importa el archivo CSS para estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faDollarSign } from '@fortawesome/free-solid-svg-icons'; // Íconos para usuario y correo
import { faWallet, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'; // Ícono para wallet
import { useUser } from '../context/UserContext'; // Importa el hook del contexto

import Modal from '../components/layout/Modal';
import AddFunds from '../components/wallet/AddFundsForm';
import TransactionHistory from '../components/wallet/TransactionHistoryForm';
import { getUserBalance, getTransactionHistory, addFundsToWallet } from '../utils/api'; // Asegúrate de tener estas funciones

const ProfilePage = () => {
  const { user, loading } = useUser(); // Obtiene el usuario del contexto y el estado de carga
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false); // Estado para manejar el error

  useEffect(() => {
    // Depuración: Verifica si se está obteniendo el usuario correctamente
    console.log("User from context:", user);

    const fetchBalance = async () => {
      try {
        if (user && user._id) {
          console.log("Fetching balance for user ID:", user._id); // Depuración del user._id
          const userBalance = await getUserBalance(user._id); // Pasamos el user._id
          setBalance(userBalance);
        } else {
          console.error("User ID is not available or user is null.");
        }
      } catch (error) {
        console.error("Error fetching balance:", error); // Depuración del error
        setFetchError(true); // Si hay un error, se marca como fallo
      }
    };

    if (!loading) { // Solo intenta obtener el balance cuando no esté cargando
      fetchBalance();
    }
  }, [user, loading]); // Dependencia de user y loading para evitar problemas

  const handleAddFunds = async (amount) => {
    try {
      await addFundsToWallet(user._id, amount); // Usar el nuevo endpoint
      const updatedBalance = await getUserBalance(user._id);
      setBalance(updatedBalance);
    } catch (error) {
      console.error("Error adding funds:", error); // Manejo de errores
    }
  };

  const handleViewHistory = async () => {
    try {
      const history = await getTransactionHistory();
      setTransactions(history);
      setHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching transaction history:", error); // Solo para propósitos de depuración
    }
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
    return <p>Loading profile...</p>; // Mostrar algo mientras el contexto carga
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
              <button className="wallet-button" onClick={handleViewHistory}>View History</button>
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
      </div>

      {/* Modal para añadir fondos */}
      <Modal isOpen={isAddFundsOpen} onClose={() => setAddFundsOpen(false)}>
        <AddFunds onClose={() => setAddFundsOpen(false)} onAddFunds={handleAddFunds} />
      </Modal>

      {/* Modal para ver el historial de transacciones */}
      <Modal isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)}>
        {historyContent}
      </Modal>
    </div>
  );
};

export default ProfilePage;
