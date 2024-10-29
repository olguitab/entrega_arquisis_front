import React, { useEffect, useState } from 'react';
import { getFixtures } from '../utils/api';
import '../styles/Fixtures.css';
import BondDetails from '../components/bonds/BondDetails'; 
import Modal from '../components/layout/Modal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const FixturesPage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [localTeamFilter, setLocalTeamFilter] = useState('');
  const [localVisitFilter, setLocalVisitFilter] = useState('');
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

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen); // Abrir o cerrar el dropdown
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

  const handleLocalTeamChange = (event) => {
    setLocalTeamFilter(event.target.value);
  };

  const handleVisitTeamChange = (event) => {
    setLocalVisitFilter(event.target.value);
  };

  const handleOddsAvailableChange = (event) => {
    setOddsAvailableFilter(event.target.checked);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const filteredFixtures = fixtures
    .filter(fixture => fixture.fixture.status.long != 'Not Started')
    .filter(fixture => 
      leagueFilter === '' || 
      fixture.league.name.toLowerCase().includes(leagueFilter.toLowerCase())
    )
    
    .filter(fixture => dateFilter === '' || new Date(fixture.fixture.date).toISOString().slice(0, 10) === dateFilter)
    .filter(fixture => 
      destinationFilter === '' || 
      fixture.league.country.toLowerCase().includes(destinationFilter.toLowerCase())
    )
    .filter(fixture =>
      localTeamFilter === '' ||
      fixture.teams.home.name.toLowerCase().includes(localTeamFilter.toLowerCase())
    )
    .filter(fixture =>
      localVisitFilter === '' ||
      fixture.teams.away.name.toLowerCase().includes(localVisitFilter.toLowerCase())
    )
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
      <h1>Past Fixtures NEW</h1>

      {/* Dropdown para los filtros */}
      <div className="filter-dropdown">
        <button className="filter-dropdown-button" onClick={toggleDropdown}>
          {isDropdownOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div
          className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}
          style={{ maxHeight: isDropdownOpen ? '1000px' : '0px' }}
        >
          <div className="filter-title">Filter By:</div>
            <div className="filter-item">
              <label className="filter-label">
                <div className="filter-description">League:</div>
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
              <div className="filter-description">Date:</div>
                <input 
                  type="date" 
                  value={dateFilter} 
                  onChange={handleDateChange} 
                />
              </label>
            </div>

            <div className="filter-item">
              <label className="filter-label">
              <div className="filter-description">Destination:</div>
                <input 
                  type="text" 
                  value={destinationFilter} 
                  onChange={handleDestinationChange} 
                  placeholder="Enter destination" 
                />
              </label>
            </div>

            <div className="filter-item">
              <label className="filter-label">
              <div className="filter-description">Local Team:</div>                
                <input 
                  type="text" 
                  value={localTeamFilter} 
                  onChange={handleLocalTeamChange} 
                  placeholder="Enter local team name" 
                />
              </label>
            </div>

            <div className="filter-item">
              <label className="filter-label">
              <div className="filter-description">Visit Team:</div>
                <input 
                  type="text" 
                  value={localVisitFilter} 
                  onChange={handleVisitTeamChange} 
                  placeholder="Enter visit team name" 
                />
              </label>
            </div>

            {/* Paginación y resultados */}
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
          </div>
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
              <div className="result">
                <div className="separator"></div>
                Goals:
                <div className="scores"> 
                  <div className="score">
                    {fixture.goals.home}
                  </div>
                  - 
                  <div className="score">
                    {fixture.goals.away}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {currentPage > 1 && (
          <button className="pagination-button" onClick={() => setCurrentPage(currentPage - 1)}>
            <FontAwesomeIcon icon={faChevronLeft} className="pagination-icon" />
          </button>
        )}
        <span>Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button className="pagination-button" onClick={() => setCurrentPage(currentPage + 1)}>
            <FontAwesomeIcon icon={faChevronRight} className="pagination-icon" />
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedFixture && <BondDetails fixture={selectedFixture} />}
      </Modal>
    </div>
  );
};

export default FixturesPage;
