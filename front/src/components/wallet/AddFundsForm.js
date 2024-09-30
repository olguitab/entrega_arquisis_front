import React, { useState } from 'react';
import '../../styles/AddFunds.css';

const AddFunds = ({ onClose, onAddFunds }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddFunds = () => {
    if (amount && parseFloat(amount) > 0) {
      onAddFunds(amount, paymentMethod); // Llamar a la función con el método de pago
      onClose(); // Cerrar el modal
    } else {
      setErrorMessage('Please enter a valid amount.');
    }
  };

  const handleQuickSelect = (value) => {
    setAmount(value); // Selección rápida de montos
    setErrorMessage(''); // Limpiar mensaje de error si ya se seleccionó un monto válido
  };

  return (
    <div className="add-funds-container">
      <h3>Add Funds</h3>

      {/* Mensaje de error */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Input para seleccionar el monto */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="funds-input"
      />

      {/* Selección rápida de montos */}
      <div className="quick-select">
        <button onClick={() => handleQuickSelect(1000)}>$1000</button>
        <button onClick={() => handleQuickSelect(2000)}>$2000</button>
        <button onClick={() => handleQuickSelect(5000)}>$5000</button>
        <button onClick={() => handleQuickSelect(10000)}>$10000</button>
      </div>

      {/* Selección del método de pago */}
      <div className="payment-method">
        <label>Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="payment-select"
        >
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <button className="button" onClick={handleAddFunds}>
        Add Funds
      </button>
    </div>
  );
};

export default AddFunds;
