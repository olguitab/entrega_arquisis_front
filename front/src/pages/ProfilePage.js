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
  const { user } = useUser(); // Obtiene el usuario del contexto
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false); // Estado para manejar el error

  useEffect(() => {
    // Obtener el balance del usuario al cargar la página
    const fetchBalance = async () => {
      try {
        const userBalance = await getUserBalance();
        setBalance(userBalance);
      } catch (error) {
        setFetchError(true); // Si hay un error, se marca como fallo
      }
    };

    fetchBalance();
  }, []);

  const handleAddFunds = async (amount) => {
    await addFundsToWallet(amount);
    const updatedBalance = await getUserBalance();
    setBalance(updatedBalance);
  };

  const handleViewHistory = async () => {
    try {
        const history = await getTransactionHistory();
        setTransactions(history);
        setHistoryOpen(true);
    } catch (error) {
        console.error("Error fetching transaction history:", error); // Solo para propósitos de depuración
        // Aquí puedes mostrar un mensaje en la interfaz, si lo deseas
    }
  };

  const historyContent = transactions.length > 0 ? (
    transactions.map((transaction, index) => (
        <div key={index}>
            {/* Renderiza tus transacciones aquí */}
            <p>{transaction.description} - ${transaction.amount}</p>
        </div>
    ))
  ) : (
      <p>No transactions found or failed to fetch transactions.</p>
  );


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
            {/* Información del usuario aquí */}
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
                {fetchError ? 'Failed to fetch balance' : `$${balance !== null ? balance : 'Loading...'}`}
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