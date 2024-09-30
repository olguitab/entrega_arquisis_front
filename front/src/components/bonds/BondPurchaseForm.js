import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../../styles/BondPurchaseForm.css';
import Modal from '../layout/Modal';
import { purchaseBond, addFundsToWallet, getUserBalance } from '../../utils/api'; // Importar la función
import AddFunds from '../wallet/AddFundsForm';


const BondPurchaseForm = ({ fixture, onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedOdd, setSelectedOdd] = useState('');
  const [error, setError] = useState('');
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const fixtureId = fixture.id;

  // Simular balance del usuario para pruebas
  const userBalance = 5000;

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!amount || !selectedOdd) {
      setError('Please enter a valid amount and select a bet type.');
      return ;
    }

    try {
      // Realiza la solicitud a la API para comprar bonos
      const response = await purchaseBond(fixtureId, amount, selectedOdd);
      console.log('Purchase successful:', response.data); // Manejar la respuesta según tus necesidades
      onClose(); // Cierra el formulario después de la compra
    } catch (error) {
      console.error('Error purchasing bond:', error);
      setError('There was an error processing your purchase.'); // Manejar errores
    }
  };

  const handleAddFunds = async (amount) => {
    await addFundsToWallet(amount);
    const updatedBalance = await getUserBalance();
    setBalance(updatedBalance);
  };

  const totalAmount = amount ? amount * 1000 : 0; // Calcular el monto total

  // Comprobar si hay odds disponibles
  const hasOdds = fixture.odds && fixture.odds[0] && fixture.odds[0].values && fixture.odds[0].values.length >= 3;

  // Calcular ganancias estimadas en base a las odds seleccionadas
  const estimatedWinnings = selectedOdd ? totalAmount * fixture.odds[0].values[{'home': 0, 'draw': 1, 'away': 2}[selectedOdd]].odd : 0;

  return (
    <div className="purchase-form-container">
      <hr className="separator" />
      <h3>Finalize Purchase</h3>

      {hasOdds ? (
        <>
          <p>Please select the amount of bonds</p>

          {/* Mensaje de error */}
          {error && <p className="failed-message">{error}</p>}

          <form onSubmit={handlePurchase}>
            <div className="input-container">
              <input
                type="number"
                placeholder="Number of bonds"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="small-input"
              />
              <p className="value-purchase">
                <div>
                  <FontAwesomeIcon icon={faDollarSign} className="value-icon" />
                </div>
                <span className='total'>
                  Total: ${totalAmount} <br />
                  Profits: ${estimatedWinnings.toFixed(2)}
                </span>
              </p>
            </div>

            {/* Selección de odds con botones */}
            <div className="odds-selection">
              <p>Select the type of bet:</p>
              <div className="odds-buttons">
                <button
                  type="button"
                  className={`odd-button ${selectedOdd === 'home' ? 'selected' : ''}`}
                  onClick={() => setSelectedOdd('home')}
                >
                  "{fixture.teams.home.name}" wins ({fixture.odds[0].values[0].odd})
                </button>
                <button
                  type="button"
                  className={`odd-button ${selectedOdd === 'draw' ? 'selected' : ''}`}
                  onClick={() => setSelectedOdd('draw')}
                >
                  Draw ({fixture.odds[0].values[1].odd})
                </button>
                <button
                  type="button"
                  className={`odd-button ${selectedOdd === 'away' ? 'selected' : ''}`}
                  onClick={() => setSelectedOdd('away')}
                >
                  "{fixture.teams.away.name}" wins ({fixture.odds[0].values[2].odd})
                </button>
              </div>
            </div>

            {/* Verificar si el balance es suficiente */}
            {totalAmount > userBalance ? (
              <>
                <p className="failed-message">Insufficient funds. Your balance is ${userBalance}.</p>

                <button className="button" onClick={() => setAddFundsOpen(true)}>Add Funds</button>
              </>
            ) : (
              <button type="submit" className="button">Buy</button>
            )}
          </form>
        </>
      ) : (
        <p className="failed-message">No odds available for this match. You cannot make a purchase at this time.</p>
      )}

      {/* Modal para añadir fondos */}
      <Modal isOpen={isAddFundsOpen} onClose={() => setAddFundsOpen(false)}>
            <AddFunds onClose={() => setAddFundsOpen(false)} onAddFunds={handleAddFunds} />
        </Modal>
    </div>
  );
};

export default BondPurchaseForm;
