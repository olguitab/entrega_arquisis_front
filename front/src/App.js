import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FixturesPage from './FixturesPage';
import UsersPage from './UsersPage';
import ProfilePage from './ProfilePage'; // Asegúrate de importar el nuevo componente
import './style.css';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <h1>Football Casino</h1>
        <ul>
          <li>
            <Link to="/fixtures">Fixtures</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/profile">Perfil</Link>
          </li>
        </ul>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/fixtures" element={<FixturesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Asegúrate de agregar la nueva ruta aquí */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;