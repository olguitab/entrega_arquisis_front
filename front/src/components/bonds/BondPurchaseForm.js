import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../../styles/BondPurchaseForm.css';
import Modal from '../layout/Modal';
import { purchaseBond, addFundsToWallet, getUserBalance, getTotalBondsAvailable, payWithWallet } from '../../utils/api';
import AddFunds from '../wallet/AddFundsForm';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import ConfirmWalletPurchaseForm from './ConfirmWalletPurchaseForm';
import ConfirmWebpayPurchaseForm from './ConfirmWebpayPurchaseForm';
import { useNavigate } from 'react-router-dom';


const BondPurchaseForm = ({ fixture, onClose }) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [amount, setAmount] = useState('');
  const [selectedOdd, setSelectedOdd] = useState('');
  const [error, setError] = useState('');
  const [isAddFundsOpen, setAddFundsOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [resultChoice, setResultChoice] = useState('');
  const [availableBonds, setAvailableBonds] = useState(0); // Nuevo estado para los bonos disponibles
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [webpayData, setWebpayData] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const fixtureId = fixture.fixture.id;


  useEffect(() => {
    if (selectedOdd === 'home') {
      setResultChoice(fixture.teams.home.name);
    } else if (selectedOdd === 'away') {
      setResultChoice(fixture.teams.away.name);
    } else if (selectedOdd === 'draw') {
      setResultChoice('---');
    }
  }, [selectedOdd, fixture.teams.home.name, fixture.teams.away.name]);

  // Fetch user balance
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

  // Fetch available bonds
  useEffect(() => {
    const fetchAvailableBonds = async () => {
      try {
        const bondsAvailable = await getTotalBondsAvailable(fixtureId); // Obtén los bonos disponibles
        setAvailableBonds(bondsAvailable);
      } catch (error) {
        console.error("Error fetching available bonds:", error);
      }
    };

    fetchAvailableBonds();
  }, [fixtureId]);

  const handleGoPay = async (e) => {

    e.preventDefault();
    if (!amount || !selectedOdd) {
      setError('Please enter a valid amount and select a bet type.');
      return;
    }

    if (totalAmount > balance && wallet) {
      setError('Insufficient funds. Please add funds to your wallet.');
      return;
    }

    const betDetails = {
      request_id: uuidv4(),
      group_id: "23",
      fixture_id: parseInt(fixtureId),
      league_name: fixture.league?.name,
      round: fixture.league?.round,
      date: new Date(fixture.fixture.date),
      result: resultChoice,
      deposit_token: "",
      datetime: new Date().toISOString(),
      quantity: parseInt(amount, 10),
      seller: 0,
      id_usuario: user._id,
      wallet: wallet, // TO DO: obtener el bool dependiendo de la elección del usuario
    };

    try{
      const response = await purchaseBond(betDetails);
    
      if (!wallet){
        setWebpayData({ url: response.url, token: response.token});
        setTransactionId(response.transactionId)
        //sessionStorage.setItem('transactionId', response.transactionId);
        localStorage.setItem('wallet', 'false');
      }
      else{
        localStorage.setItem('wallet', 'true');
      }
      setShowConfirmation(true); // Muestra el componente de confirmación
    } catch(error){
      console.log('error:', error);
    };

  };

  // const handlePurchase = async (e) => {
  //   e.preventDefault();
  //   if (!amount || !selectedOdd) {
  //     setError('Please enter a valid amount and select a bet type.');
  //     return;
  //   }

  //   if (totalAmount > balance) {
  //     setError('Insufficient funds. Please add funds to your wallet.');
  //     return;
  //   }

  //   const betDetails = {
  //     request_id: uuidv4(),
  //     group_id: "23",
  //     fixture_id: parseInt(fixtureId),
  //     league_name: fixture.league?.name,
  //     round: fixture.league?.round,
  //     date: new Date(fixture.fixture.date),
  //     result: resultChoice,
  //     deposit_token: "",
  //     datetime: new Date().toISOString(),
  //     quantity: parseInt(amount, 10),
  //     seller: 0,
  //     id_usuario: user._id,
  //     wallet: false, // TO DO: obtener el bool dependiendo de la elección del usuario
  //   };

  //   setWallet(false);

  //   try {
  //     const response = await purchaseBond(betDetails);

  //     //await payWithWallet(user._id, amount * -1000);
      
  //     console.log('Purchase successful:', response.data);
  //     alert('Purchase successful!');
  //     onClose();
  //   } catch (error) {
  //     console.error('Error purchasing bond:', error);
  //     setError('There was an error processing your purchase: ' + error.message);
  //   }
  // };

  const handleAddFunds = async (amount) => {
    try {
      await addFundsToWallet(user._id, amount);
      const updatedBalance = await getUserBalance(user._id);
      setBalance(updatedBalance);
      setAddFundsOpen(false);
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleAddFundsClick = (e) => {
    e.preventDefault();
    setAddFundsOpen(true);
  };

  const totalAmount = amount ? amount * 1000 : 0;
  const hasOdds = fixture.odds && fixture.odds[0] && fixture.odds[0].values && fixture.odds[0].values.length >= 3;
  const estimatedWinnings = selectedOdd ? totalAmount * fixture.odds[0].values[{'home': 0, 'draw': 1, 'away': 2}[selectedOdd]].odd : 0;

  return (
    <>
      {showConfirmation && wallet ? (
        <ConfirmWalletPurchaseForm
          fixture={fixture}
          amount={amount}
          selectedOdd={selectedOdd}
          estimatedWinnings={estimatedWinnings}
          onConfirm={() => navigate('/successful-purchase') } // TO DO: revisar bien el flujo de pago con wallet
          onCancel={() => setShowConfirmation(false)}
        />        
      ) : showConfirmation && !wallet  ? (
        <ConfirmWebpayPurchaseForm
          fixture={fixture}
          amount={amount}
          selectedOdd={selectedOdd}
          estimatedWinnings={estimatedWinnings}
          url={webpayData.url}
          token={webpayData.token}
          transactionId={transactionId}
          onClose={() => setShowConfirmation(false)}
        />
      ): (
    <div className="purchase-form-container">
      <hr className="separator" />
      <h3>Finalize Purchase</h3>

      {hasOdds ? (
        <>
          <p>Please select the amount of bonds</p>

          {error && <p className="failed-message">{error}</p>}

          <form onSubmit={handleGoPay}>
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

            <div className='available-bonds'>
              <p>Available bonds:</p> {/* Mostrar los bonos disponibles */}
              <div className='value-gray'>{availableBonds}</div>
            </div>

            <div className="payment-method">
              <p>Choose your payment method:</p>
              <div className="payment-method-options">
                <input
                  type="radio"
                  id="wallet"
                  value="wallet"
                  checked={wallet === true}
                  onChange={() => setWallet(true)}
                />
                <label htmlFor="wallet">Wallet</label>

                <input
                  type="radio"
                  id="webpay"
                  value="webpay"
                  checked={wallet === false}
                  onChange={() => setWallet(false)}
                />
                <label htmlFor="webpay">WebPay</label>
              </div>
            </div>


            {totalAmount > balance && wallet ? (
              <>
                <p className="failed-message">Insufficient funds. Your balance is ${balance}.</p>
                <button type="button" className="button" onClick={handleAddFundsClick}>Add Funds</button>
              </>
            ) : (
              <button type="submit" className="button">Go Pay</button>
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
    )}
    </>
  );
};

export default BondPurchaseForm;
