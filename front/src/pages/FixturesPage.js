import React, { useEffect, useState } from 'react';
import { getFixtures } from '../utils/api';
import '../styles/Fixtures.css';
import BondDetails from '../components/bonds/BondDetails'; 
import Modal from '../components/layout/Modal'; 

const FixturesPage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [oddsAvailableFilter, setOddsAvailableFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const handleShowModal = (fixture) => {
    setSelectedFixture(fixture);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFixture(null);
  };

  const handleLeagueChange = (event) => {
    setLeagueFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestinationFilter(event.target.value);
  };

  const handleOddsAvailableChange = (event) => {
    setOddsAvailableFilter(event.target.checked);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const filteredFixtures = fixtures
    .filter(fixture => fixture.fixture.status.long === 'Not Started')
    .filter(fixture => 
      leagueFilter === '' || 
      fixture.league.name.toLowerCase().includes(leagueFilter.toLowerCase())
    )
    
    .filter(fixture => dateFilter === '' || new Date(fixture.fixture.date).toISOString().slice(0, 10) === dateFilter)
    .filter(fixture => destinationFilter === '' || fixture.teams.home.name.includes(destinationFilter) || fixture.teams.away.name.includes(destinationFilter))
    .filter(fixture => !oddsAvailableFilter || (fixture.odds && fixture.odds[0] && fixture.odds[0].values.length > 0));

  // Pagination
  const indexOfLastFixture = currentPage * itemsPerPage;
  const indexOfFirstFixture = indexOfLastFixture - itemsPerPage;
  const currentFixtures = filteredFixtures.slice(indexOfFirstFixture, indexOfLastFixture);
  const totalPages = Math.ceil(filteredFixtures.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="fixtures-page">
      <h1>Upcoming Fixtures</h1>

      {/* Filtros */}
      <div className="filters">
        <div className="filter-item">
          <label className="filter-label">
            Filter by League:
            <input 
              type="text" 
              value={leagueFilter} 
              onChange={handleLeagueChange} 
              placeholder="Enter league name" 
            />
          </label>
        </div>

        <div className="filter-item">
          <label className="filter-label">
            Filter by Date:
            <input 
              type="date" 
              value={dateFilter} 
              onChange={handleDateChange} 
            />
          </label>
        </div>

        <div className="filter-item">
          <label className="filter-label">
            Filter by Destination:
            <input 
              type="text" 
              value={destinationFilter} 
              onChange={handleDestinationChange} 
              placeholder="Enter destination" 
            />
          </label>
        </div>

        <div className="filter-item">
          <label className="filter-label custom-checkbox">
            Available Odds
            <div className="checkbox-wrapper-3">
              <input
                type="checkbox"
                id="cbx-3"
                checked={oddsAvailableFilter}
                onChange={handleOddsAvailableChange}
              />
              <label htmlFor="cbx-3" className="toggle"><span></span></label>
            </div>
          </label>
        </div>
      </div>

      {/* Resultados encontrados */}
      <div className="results-info">
        <div className="items-per-page">
          <label className="filter-label">
            Items per Page:
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </label>
        </div>
        <p>{filteredFixtures.length} results found. Showing {indexOfFirstFixture + 1}–{Math.min(indexOfLastFixture, filteredFixtures.length)} of {filteredFixtures.length}</p>
      </div>

      <ul>
        {currentFixtures.map((fixture) => (
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
                {fixture.odds && fixture.odds[0] && fixture.odds[0].values.length > 0 ? (
                  fixture.odds[0].values.map((odd, index) => (
                    <div key={index} className="odd">
                      {odd.value}: {odd.odd}
                    </div>
                  ))
                ) : (
                  <div className="failed-text">No odds available</div>
                )}
              </div>
              <button className="bet-button" onClick={() => handleShowModal(fixture)}>
                See more
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`} 
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedFixture && <BondDetails fixture={selectedFixture} />}
      </Modal>
    </div>
  );
};

export default FixturesPage;
