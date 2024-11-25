import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // Importa la barra de navegación
import Footer from './components/layout/Footer'; // Importa el footer
import AppRoutes from './routes/AppRoutes'; // Importa el componente de rutas
import PageTransitionWrapper from './components/layout/PageTransitionWrapper'; // Importa el wrapper de transiciones
import './styles/Global.css';

const App = () => {
  return (
    <Router>
      <Navbar /> 
      <PageTransitionWrapper>
        <div className="page-transition">
          <div className="container">
            <AppRoutes />  
          </div>
        </div>
      </PageTransitionWrapper>
      <Footer />
    </Router>
  );
};

export default App;
