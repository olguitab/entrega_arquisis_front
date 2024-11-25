import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [key, setKey] = useState(Date.now()); // Cambia la key para reiniciar la animación

  useEffect(() => {
    setKey(Date.now()); // Cambia la key cada vez que la ubicación cambie
  }, [location]);

  return (
    <div key={key} className="page-transition-wrapper">
      <div className="page-transition">
        {children}
      </div>
    </div>
  );
};

export default PageTransitionWrapper;
