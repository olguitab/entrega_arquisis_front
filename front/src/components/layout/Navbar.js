// components/layout/Navbar.js
import '../../styles/Navbar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/users');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-content') && !event.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isAuthenticated = !!user;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">
            <div className="title-text">Futbet</div>
            <div className="title-number">23</div>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        <div className={`nav-content ${isMenuOpen ? 'show' : ''}`}>
          <div className="sidebar-content">
            <ul className="left">
              <li><Link to="/fixtures" onClick={() => setIsMenuOpen(false)}>upcoming fixtures</Link></li>
              <li><Link to="/past-fixtures" onClick={() => setIsMenuOpen(false)}>past fixtures</Link></li>
              <li><Link to="/recommendations" onClick={() => setIsMenuOpen(false)}>recommendations</Link></li>
            </ul>

            <ul className="right">
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/bet-history" className="bet-history-link" onClick={() => setIsMenuOpen(false)}>
                      <span>bet history</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="profile-link" onClick={() => setIsMenuOpen(false)}>
                      <FontAwesomeIcon icon={faUser} className="profile-icon" />
                      <span>profile</span>
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated ? (
                <li>
                  <button className="logout-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </button>
                </li>
              ) : (
                <li><Link to="/users" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;