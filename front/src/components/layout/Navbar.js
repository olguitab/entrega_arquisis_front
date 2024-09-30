// components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Importa el hook del contexto
import '../../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'; // Íconos de Logout y Perfil

const Navbar = () => {
  const { user, logout } = useUser(); // Obtén el estado del usuario y la función de logout del contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Usa la función de logout del contexto
    navigate('/users'); // Redirige a la página de inicio o login
  };

  // Verifica si el usuario está autenticado
  const isAuthenticated = !!user;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        <h1>Football Casino</h1>
      </Link>
      <ul className="left">
        <li><Link to="/fixtures">Upcoming Fixtures</Link></li>
        <li><Link to="/past-fixtures">Past Fixtures</Link></li>
      </ul>
      <ul className="right">
        {isAuthenticated && (
          <li>
            <Link to="/profile" className="profile-link">
              <FontAwesomeIcon icon={faUser} className="profile-icon" />
              <span>Profile</span>
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
