import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // Importa la barra de navegación
import AppRoutes from './routes/AppRoutes'; // Importa el componente de rutas
import './styles/Global.css'; 


const App = () => {
  return (
    <Router>
      <Navbar /> 
      <div className="container">
        <AppRoutes />  
      </div>
    </Router>
  );
};

export default App;
