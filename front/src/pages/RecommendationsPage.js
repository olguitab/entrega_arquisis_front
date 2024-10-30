import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Contexto de usuario
import { getRecommendations, getJobResults } from '../utils/api';
import BondDetails from '../components/bonds/BondDetails'; // Importa el componente de detalles de la apuesta
import Modal from '../components/layout/Modal'; // Importa el componente de modal
import '../styles/RecommendationsPage.css';

const RecommendationsPage = () => {
  const { user, loading } = useUser();
  const [jobId, setJobId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingJob, setLoadingJob] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null); // Estado para el fixture seleccionado
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura del modal

  const handleGetRecommendations = async () => {
    try {
      setLoadingJob(true);
      const response = await getRecommendations(user._id); // Usa el ID del usuario del contexto
      setJobId(response.job_id);
      setJobError(null); // Restablece cualquier error previo
    } catch (error) {
      setJobError('Error initializing recommendation job');
    } finally {
      setLoadingJob(false);
    }
  };

  const handleGetJobResults = async () => {
    if (!jobId) {
      alert("No job initialized yet!");
      return;
    }
    try {
      setLoadingJob(true);
      const results = await getJobResults(jobId);
      
      // Check if the job is ready and has recommendations
      if (results.ready) {
        setRecommendations(results.recommendations);
        setJobError(null);
      } else {
        setJobError('Recommendations are still loading. Please check back in a moment.');
      }
    } catch (error) {
      setJobError('Error fetching job results');
    } finally {
      setLoadingJob(false);
    }
  };

  const handleShowModal = (fixture) => {
    setSelectedFixture(fixture);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFixture(null);
  };

  if (loading) return <p>Loading user data...</p>;

  if (!user) {
    return (
      <div className="recommendations-page">
        <h2>Please log in to access recommendations.</h2>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <h2>Recommendations</h2>

      {!jobId ? (
        <button onClick={handleGetRecommendations} disabled={loadingJob}>
          Initialize Job
        </button>
      ) : (
        <button onClick={handleGetJobResults} disabled={loadingJob}>
          Fetch Job Results
        </button>
      )}

      {jobError && <p>{jobError}</p>}

      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <h3>Recommended Fixtures:</h3>
          <ul>
            {recommendations.map((fixture, index) => (
              <li key={index}>
                <div className="fixture-details">
                  <div className="team-info">
                    <div className="team home-team">
                      <img
                        src={fixture.fixture_data.teams.home.logo}
                        alt={fixture.fixture_data.teams.home.name}
                        className="team-logo"
                      />
                      <strong>{fixture.fixture_data.teams.home.name}</strong>
                    </div>
                    <div className="vs">vs</div>
                    <div className="team away-team">
                      <img
                        src={fixture.fixture_data.teams.away.logo}
                        alt={fixture.fixture_data.teams.away.name}
                        className="team-logo"
                      />
                      <strong>{fixture.fixture_data.teams.away.name}</strong>
                    </div>
                  </div>
                  <div className="fixture-time">
                    Date: {new Date(fixture.fixture_data.fixture.date).toLocaleString()}
                  </div>
                  <div className="league-info">
                    League: {fixture.fixture_data.league.name}
                  </div>
                  <div className="recommended-winner">
                    Recommended Winner: {fixture.recommended_winner}
                  </div>
                  {/* Botón "Ver más" para abrir el modal */}
                  <button className="bet-button" onClick={() => handleShowModal(fixture.fixture_data)}>
                    See More
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal para mostrar detalles de la apuesta */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedFixture && <BondDetails fixture={selectedFixture} />}
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
