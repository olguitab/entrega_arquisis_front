import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-button" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
