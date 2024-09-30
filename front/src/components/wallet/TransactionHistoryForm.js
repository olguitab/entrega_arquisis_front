// components/wallet/TransactionHistory.js
import React from 'react';
import '../../styles/TransactionHistory.css';

const TransactionHistory = ({ transactions, onClose }) => {
  return (
    <div className="transaction-history-container">
      <h3>Transaction History</h3>
      {transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map((transaction, index) => (
            <li key={index}>
              <div>Date: {new Date(transaction.date).toLocaleString()}</div>
              <div>Amount: ${transaction.amount}</div>
              <div>Type: {transaction.type}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default TransactionHistory;
