import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import BondPurchaseForm from './BondPurchaseForm';
import '../../styles/BondDetails.css';

const BondDetails = ({ fixture }) => {
  const [isPurchaseFormVisible, setPurchaseFormVisible] = useState(false);

  const togglePurchaseForm = () => {
    setPurchaseFormVisible(!isPurchaseFormVisible);
  };

  // Nueva función para cerrar el formulario
  const handleCloseForm = () => {
    setPurchaseFormVisible(false);
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
      <div className="status">
        Status: {fixture.fixture.status.long}
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
            <button
              className={`bet-button ${isPurchaseFormVisible ? 'cancel-button' : ''}`}
              onClick={togglePurchaseForm}
            >
              {isPurchaseFormVisible ? 'Cancel' : 'Buy bonds'}
            </button>
            {isPurchaseFormVisible && (
              <div className="purchase-form-container">
                <BondPurchaseForm fixture={fixture} onClose={handleCloseForm} /> {/* Pasar onClose aquí */}
              </div>
            )}
          </>
        ) : (
          <div>No odds available</div>
        )}
      </div>
    </div>
  );
};

export default BondDetails;
