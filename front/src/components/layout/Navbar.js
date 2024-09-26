// components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Navbar.css';
// Importa los íconos de Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'; // Íconos de Logout y Perfil

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    
    // Elimina el header de autorización de axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirige a la página de inicio o login
    navigate('/users');
  };

  // Verifica si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('userToken');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title"> {/* Añadir Link aquí para redirigir al inicio */}
        <h1>Football Casino</h1>
      </Link>
      <ul className="left">
        <li><Link to="/fixtures">Fixtures</Link></li>
      </ul>
      <ul className="right">
        {isAuthenticated && (
          <li>
            <Link to="/profile" className="profile-link">
              {/* Ícono de perfil al lado del texto */}
              <FontAwesomeIcon icon={faUser} className="profile-icon" />
              <span>Perfil</span>
            </Link>
          </li>
        )}
        {isAuthenticated ? (
          <li>
            <button className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </li>
        ) : (
          <li><Link to="/users">Login</Link></li> 
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
