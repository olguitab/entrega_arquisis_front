import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Maneja la lógica para cerrar el modal
  const handleClose = () => {
    setIsExiting(true); // Inicia la animación de salida
    const timer = setTimeout(() => {
      onClose(); // Llama a la función onClose después de la animación
    }, 400); // Duración de la animación

    return () => clearTimeout(timer); // Limpia el timer si se desmonta
  };

  // Maneja el efecto al abrir/cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setIsExiting(true); // Si se cierra el modal, activa la animación de salida
      const timer = setTimeout(() => {
        setIsExiting(false); // Reinicia el estado después de la animación
      }, 400); // Debe coincidir con la duración de la animación de salida

      return () => clearTimeout(timer); // Limpia el timer si se desmonta
    } else {
      setIsExiting(false); // Si se abre el modal, resetea el estado
    }
  }, [isOpen]);

  // No renderizar si no está abierto y no está saliendo
  if (!isOpen && !isExiting) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isExiting ? 'fade-out-content' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-button" onClick={handleClose}>✖</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
