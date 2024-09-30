import React, { useEffect, useState } from 'react';
import { getWalletBalance, addFunds, getTransactions } from '../../utils/api';
import '../../styles/Wallet.css';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [funds, setFunds] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener el balance del usuario cuando se carga el componente
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await getWalletBalance();
      setBalance(response.data.balance);
    } catch (error) {
      setError('Error fetching wallet balance.');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data.transactions);
    } catch (error) {
      setError('Error fetching transactions.');
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!funds || isNaN(funds) || funds <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      await addFunds(funds);
      setFunds('');
      fetchWalletBalance(); // Refrescar balance
    } catch (error) {
      setError('Error adding funds to wallet.');
    }
  };

  return (
    <div className="wallet-container">
      <h2>Wallet Balance: ${balance.toFixed(2)}</h2>

      <form onSubmit={handleAddFunds} className="add-funds-form">
        <input
          type="number"
          placeholder="Amount to add"
          value={funds}
          onChange={(e) => setFunds(e.target.value)}
        />
        <button type="submit">Add Funds</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <h3>Transaction History</h3>
      <ul className="transaction-list">
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.date} - {transaction.type}: ${transaction.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wallet;
