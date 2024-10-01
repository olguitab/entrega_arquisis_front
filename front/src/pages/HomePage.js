import React from 'react';
import { useUser } from '../context/UserContext';
import FixturesPage from './UpcomingFixturesPage';
import LoginForm from '../components/auth/LoginForm';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import { Link, NavLink } from 'react-router-dom';
import '../styles/HomePage.css'; // Asegúrate de tener un archivo CSS para estilos de HomePage

const HomePage = () => {
  const { user } = useUser(); // Obtén el estado del usuario del contexto

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to CoolGoat Betting</h1>
        <p>Your favorite place to place bets on sports events!</p>
      </header>

      <section className="widgets-container">
        <div className="fixtures-widget">
          {/* boton para ver todos los fixtures que redirga a /fixtures y use la clase button-submit */}
            <Link to="/fixtures" className="button">View All Fixtures</Link>

          <FixturesPage limit={2} /> {/* Asegúrate de que este componente solo muestra 2 elementos */}
        </div>

        <div className="auth-widget">
          {user ? <ProfilePage /> : <UsersPage />} {/* Muestra el perfil o el formulario de login */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
