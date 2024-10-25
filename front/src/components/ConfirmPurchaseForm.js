import React from 'react';
import Modal from './layout/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const ConfirmPurchaseForm = ({ fixture, amount, selectedOdd, estimatedWinnings, onConfirm, onClose }) => {
  const totalAmount = amount ? amount * 1000 : 0;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="confirmation-container">
        <h3>Resumen de la Compra</h3>

        <div className="confirmation-details">
          <div className="confirmation-item">
            <strong>Partido:</strong> <span>{fixture.teams.home.name} vs {fixture.teams.away.name}</span>
          </div>
          <div className="confirmation-item">
            <strong>Elección de Apuesta:</strong> <span>{selectedOdd === 'home' ? fixture.teams.home.name : selectedOdd === 'away' ? fixture.teams.away.name : 'Empate'}</span>
          </div>
          <div className="confirmation-item">
            <strong>Costo:</strong> <span>
              <FontAwesomeIcon icon={faDollarSign} className="value-icon" />
              {totalAmount.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="confirmation-item">
            <strong>Ganancia Potencial:</strong> <span>
              <FontAwesomeIcon icon={faDollarSign} className="value-icon" />
              {estimatedWinnings.toFixed(2).toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        <button className="button" onClick={onConfirm}>Ir a pagar</button>
      </div>
    </Modal>
  );
};

export default ConfirmPurchaseForm;
