import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'; // Asegúrate de importar el CSS para estilos específicos

const FixturesPage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get('http://localhost:3001/fixtures');
        setFixtures(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching fixtures');
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="fixtures-page">
      <h1>Upcoming Fixtures</h1>
      <ul>
        {fixtures
          .filter(fixture => fixture.fixture.status.long === 'Not Started')
          .map((fixture) => (
            <li key={fixture.fixture.id} className="fixture-item">
              <div className="fixture-details">
                <div className="team-info">
                  <div className="team home-team">
                    <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="team-logo" />
                    <strong>{fixture.teams.home.name}</strong>
                  </div>
                  <div className="vs">vs</div>
                  <div className="team away-team">
                    <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="team-logo" />
                    <strong>{fixture.teams.away.name}</strong>
                  </div>
                </div>
                <div className="fixture-time">
                  Date: {new Date(fixture.fixture.date).toLocaleString()}
                </div>
                <div className="league-info">
                  League: {fixture.league.name}, Round: {fixture.league.round}
                </div>
                <div className="status">
                  Status: {fixture.fixture.status.long}
                </div>
                <div className="odds">
                  <h2>Odds:</h2>
                  {fixture.odds && fixture.odds[0] && fixture.odds[0].values.map((odd, index) => (
                    <div key={index} className="odd">
                      {odd.value}: {odd.odd}
                    </div>
                  ))}
                </div>
                <button className="bet-button">Place Bet</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FixturesPage;