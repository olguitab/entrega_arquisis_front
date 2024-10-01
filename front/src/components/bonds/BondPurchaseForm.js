import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../../styles/BondPurchaseForm.css';
import Modal from '../layout/Modal';
import { purchaseBond, addFundsToWallet, getUserBalance } from '../../utils/api';
import AddFunds from '../wallet/AddFundsForm';
import { useUser } from '../../context/UserContext'; // Importa el hook del contexto
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para generar IDs únicos

const BondPurchaseForm = ({ fixture, onClose }) => {
  const { user, loading } = useUser(); // Obtiene el usuario del contexto y el estado de carga
  const [amount, setAmount] = useState('');
  const [selectedOdd, setSelectedOdd] = useState('');
  const [error, setError] = useState('');
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [balance, setBalance] = useState(null); // Balance real del usuario
  const [fetchError, setFetchError] = useState(false);
  const fixtureId = fixture.fixture.id;

  // Obtener balance real del usuario al cargar el componente
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

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!amount || !selectedOdd) {
      setError('Please enter a valid amount and select a bet type.');
      return;
    }

    const betDetails = {
      request_id: uuidv4(),
      group_id: "23", // Cambia según tu lógica
      fixture_id: parseInt(fixtureId),
      league_name: fixture.league?.name,
      round: fixture.league?.round,
      date: new Date(fixture.fixture.date).toLocaleString(),
      result: selectedOdd,
      deposit_token: "",
      datetime: new Date().toISOString(),
      quantity: parseInt(amount, 10),
      seller: 0
    };

    try {
      const response = await purchaseBond(betDetails);
      console.log('Purchase successful:', response.data);
      alert('Purchase successful!');
      onClose();
    } catch (error) {
      console.error('Error purchasing bond:', error);
      setError('There was an error processing your purchase: ' + error.message);
    }
  };

  const handleAddFunds = async (amount) => {
    await addFundsToWallet(amount);
    const updatedBalance = await getUserBalance();
    setBalance(updatedBalance);
  };

  const totalAmount = amount ? amount * 1000 : 0; 
  const hasOdds = fixture.odds && fixture.odds[0] && fixture.odds[0].values && fixture.odds[0].values.length >= 3;
  const estimatedWinnings = selectedOdd ? totalAmount * fixture.odds[0].values[{'home': 0, 'draw': 1, 'away': 2}[selectedOdd]].odd : 0;

  return (
    <div className="purchase-form-container">
      <hr className="separator" />
      <h3>Finalize Purchase</h3>

      {hasOdds ? (
        <>
          <p>Please select the amount of bonds</p>

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
              <div className="value-purchase">
                <div>
                  <FontAwesomeIcon icon={faDollarSign} className="value-icon" />
                </div>
                <span className='total'>
                  Total: ${totalAmount} <br />
                  Profits: ${estimatedWinnings.toFixed(2)}
                </span>
              </div>
            </div>

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

            {totalAmount > balance ? (
              <>
                <p className="failed-message">Insufficient funds. Your balance is ${balance}.</p>
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

      <Modal isOpen={isAddFundsOpen} onClose={() => setAddFundsOpen(false)}>
        <AddFunds onClose={() => setAddFundsOpen(false)} onAddFunds={handleAddFunds} />
      </Modal>
    </div>
  );
};

export default BondPurchaseForm;
