// pages/FixturesPage.js
import React, { useEffect, useState } from 'react';
import { getFixtures } from '../utils/api';
import '../styles/Fixtures.css';
import BondDetails from '../components/bonds/BondDetails'; // Importamos el componente BondDetails
import Modal from '../components/layout/Modal'; // Importamos el nuevo Modal

const FixturesPage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null); // Nuevo estado para el partido seleccionado
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        const fixturesData = await getFixtures();
        setFixtures(fixturesData);
      } catch (err) {
        setError('Error fetching fixtures');
      } finally {
        setLoading(false);
      }
    };

    loadFixtures();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleShowModal = (fixture) => {
    setSelectedFixture(fixture);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFixture(null); // Limpiar el fixture seleccionado
  };

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
                <button className="bet-button" onClick={() => handleShowModal(fixture)}>
                  See more
                </button>
              </div>
            </li>
          ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedFixture && <BondDetails fixture={selectedFixture} />}
      </Modal>
    </div>
  );
};

export default FixturesPage;
