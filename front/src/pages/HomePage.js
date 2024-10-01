import React from 'react';
import { useUser } from '../context/UserContext';
import FixturesPage from './UpcomingFixturesPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useUser();

  return (
    <div className="home-container">
      <section className="widgets-container">
        <div className="fixtures-widget">
          <FixturesPage limit={2} />
          <Link to="/fixtures" className="button-more">View All Fixtures</Link>
        </div>

        <div className="welcome-auth-widget">
          <div className="welcome-widget">
            <h1>Welcome to Futbet23</h1>
            <span className="dividor"></span>
            <p>Your favorite place to place bets on football events!</p>
          </div>
          <div className="profile-widget">
            {user ? <ProfilePage /> : null}
          </div>
          <div className="auth-widget">
            {!user ? <UsersPage /> : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
