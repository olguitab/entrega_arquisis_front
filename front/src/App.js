import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // Importa la barra de navegación
import Footer from './components/layout/Footer'; // Importa el footer
import AppRoutes from './routes/AppRoutes'; // Importa el componente de rutas
import './styles/Global.css'; 


const App = () => {
  return (
    <Router>
      <Navbar /> 
      <div className="container">
        <AppRoutes />  
      </div>
      <Footer />
    </Router>
  );
};

export default App;
