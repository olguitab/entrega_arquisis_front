import React from 'react';
import Modal from './layout/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const ConfirmWebpayPurchaseForm = ({ fixture, amount, selectedOdd, estimatedWinnings, url, token, onClose, transactionId }) => {
  const totalAmount = amount ? amount * 1000 : 0;
  sessionStorage.setItem('transactionId', transactionId);

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

            {/* Formulario para redirigir a WebPay */}
            <form action={url} method="POST">
            {/* Campo oculto para enviar el token */}
            <input type="hidden" name="token_ws" value={token} />
            
            {/* Botón que envía el formulario */}
            <button type="submit" className="button">Ir a pagar</button>
            </form>
        </div>
        </Modal>
    );
};

export default ConfirmWebpayPurchaseForm;
