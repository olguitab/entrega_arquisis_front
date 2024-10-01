import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import BondPurchaseForm from './BondPurchaseForm';
import { useUser } from '../../context/UserContext'; 
import WorldFlag from 'react-world-flags';  // Importa el componente de banderas
import '../../styles/BondDetails.css';
import { useNavigate } from 'react-router-dom';  

const BondDetails = ({ fixture }) => {
  const [isPurchaseFormVisible, setPurchaseFormVisible] = useState(false);
  const { user } = useUser();  
  const navigate = useNavigate();  

  const togglePurchaseForm = () => {
    setPurchaseFormVisible(!isPurchaseFormVisible);
  };

  const handleCloseForm = () => {
    setPurchaseFormVisible(false);
  };

  const handleLoginRedirect = () => {
    navigate('/users');  
  };

  const countryCodeMap = {
    'England': 'GB',
    'Spain': 'ES',
    'France': 'FR',
    'Germany': 'DE',
    'Italy': 'IT',
    'Netherlands': 'NL',
    'Portugal': 'PT',
  };

  return (
    <div className="bond-details">
      <div className="team-info">
        <div className="team home-team">
          <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="team-logo" />
          <strong>{fixture.teams.home.name}</strong>
        </div>
        <div className="vs">vs</div>
        <div className="team away-team">
          <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="team-logo" />
          <strong>{fixture.teams.away.name}</strong>
        </div>
      </div>
      <div className="fixture-time">
        Date: {new Date(fixture.fixture.date).toLocaleString()}
      </div>
      <div className="league-info">
        League: {fixture.league.name}, Round: {fixture.league.round}
      </div>
      <div className="country-info">
        <div className="status">Country:</div>
        <WorldFlag code={countryCodeMap[fixture.league.country] || 'US'} className="country-flag" /> 
        <span className="country-name">{fixture.league.country}</span>
      </div>
      <div className="country-info">
        <div className="status">
          Status: 
        </div>
        <div className="country-name">
          {fixture.fixture.status.long}
        </div>
      </div>
      <hr className="separator" />

      <div className="odds">
        <h2>Odds:</h2>
        {fixture.odds && fixture.odds[0] && fixture.odds[0].values.length > 0 ? (
          <>
            {fixture.odds[0].values.map((odd, index) => (
              <div key={index} className="odd">
                {odd.value}: {odd.odd}
              </div>
            ))}
            <div className="value">
              <FontAwesomeIcon icon={faDollarSign} className="value-icon" />
              Bonus Value: 1.000
            </div>

            {user ? (
              <>
                <button
                  className={`bet-button ${isPurchaseFormVisible ? 'cancel-button' : ''}`}
                  onClick={togglePurchaseForm}
                >
                  {isPurchaseFormVisible ? 'Cancel' : 'Buy bonds'}
                </button>
                {isPurchaseFormVisible && (
                  <div className="purchase-form-container">
                    <BondPurchaseForm fixture={fixture} onClose={handleCloseForm} />
                  </div>
                )}
              </>
            ) : (
              <div className="login-required">
                <p>You need to be logged in to buy bonds.</p>
                <button className="bet-button" onClick={handleLoginRedirect}>
                  Login
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="failed-message">No odds available for this match. You cannot make a purchase at this time.</p>
        )}
      </div>
    </div>
  );
};

export default BondDetails;
