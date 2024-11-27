import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Importar el contexto de usuario
import { useNavigate } from 'react-router-dom'; // Usar para redirigir
import { getFixtures, getBetHistory, getFixture } from '../utils/api'; // Traer los bonos disponibles
import '../styles/Fixtures.css'; // Estilos de los fixtures
import '../styles/AdminPanel.css'; // Estilos de los fixtures

import Modal from '../components/layout/Modal'; 
import BondDetails from '../components/bonds/BondDetails'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AdminPanelPage = () => {
  const { user, loading } = useUser(); // Obtener el usuario actual
  const [bonds, setBonds] = useState([]); // Estado para los bonos
  const [isLoading, setIsLoading] = useState(true); // Cargar datos
  const [isModalOpen, setModalOpen] = useState(false); // Modal abierto
  const [selectedBond, setSelectedBond] = useState(null); // Bono seleccionado
  const [currentPage, setCurrentPage] = useState(1); // Paginación
  const [itemsPerPage, setItemsPerPage] = useState(6); // Items por página
  const [filtersAvailable, setFiltersAvailable] = useState(true); // Mostrar filtros
  const [leagueFilter, setLeagueFilter] = useState(''); // Filtro de liga
  const [destinationFilter, setDestinationFilter] = useState(''); // Filtro de destino
  const [showFixtures, setShowFixtures] = useState(false); // Estado para mostrar u ocultar los fixtures
  const [showHistory, setShowHistory] = useState(false); // Estado para mostrar u ocultar los fixtures

  const [error, setError] = useState(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [localTeamFilter, setLocalTeamFilter] = useState('');
  const [localVisitFilter, setLocalVisitFilter] = useState('');
  const [oddsAvailableFilter, setOddsAvailableFilter] = useState(false);

  const [bets, setBets] = useState([]);
  const [fixtures, setFixtures] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  const navigate = useNavigate(); // Redirigir a otra página

  useEffect(() => {
    // Verificar si el usuario tiene acceso
    if (!loading && (!user || user.email !== 'admin@uc.cl')) {
      navigate('/'); // Redirigir a la página principal si no es admin
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchBonds = async () => {
      try {
        const fixturesData = await getFixtures();
        setBonds(fixturesData);
      } catch (error) {
        console.error('Error fetching bonds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.email === 'admin@uc.cl') {
      fetchBonds();
    }
  }, [user]);

  useEffect(() => {
    const fetchBetHistory = async () => {
      if (!user || loading) return;

      try {
        // const betHistory = await getBetHistory('66feaf7905358b6db363a67e');
        const betHistory = await getBetHistory(user._id);
        setBets(betHistory);

        const fixturePromises = betHistory.map(async (bet) => {
          const fixture = await getFixture(bet.fixture_id);
          return { [bet.fixture_id]: fixture };
        });

        const fixtureResults = await Promise.all(fixturePromises);
        const fixtureMap = fixtureResults.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        setFixtures(fixtureMap);

      } catch (err) {
        setError('Error fetching bet history');
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchBetHistory();
  }, [user, loading]);

  const handleShowModal = (fixture) => {
    setSelectedBond(fixture);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBond(null);
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

  const filteredBonds = bonds
    .filter(fixture => fixture.fixture.status.long === 'Not Started')
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


  // Paginación
  const indexOfLastBond = currentPage * itemsPerPage;
  const indexOfFirstBond = indexOfLastBond - itemsPerPage;
  const currentBonds = filteredBonds.slice(indexOfFirstBond, indexOfLastBond);
  const totalPages = Math.ceil(filteredBonds.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="fixtures-page">
    <h1>Admin Panel</h1>

    <div className="button-container">
      <button className="button" onClick={() => setShowFixtures(!showFixtures)}>
        {showFixtures ? 'Hide Fixtures' : 'Show Fixtures'}
      </button>

      <button className="button" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? 'Hide History' : 'Show History'}
      </button>
    </div>

      {showFixtures && (
      <div>
        {filtersAvailable && (
        <div className="filter-dropdown">
          <button className="filter-dropdown-button" onClick={toggleDropdown}>
            {isDropdownOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          <div
            className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}
            style={{ maxHeight: isDropdownOpen ? '1000px' : '0px' }}
          >
            <div className="filter-title">Filter By:</div>
            {/* Aquí se incluyen todos los filtros */}
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

            <div className="filter-item">
              <label className="filter-label custom-checkbox">
                <div className="filter-description">Available Odds</div>
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

              {/* Paginación y resultados */}
              <div className="results-info">
                <div className="items-per-page">
                  <label className="filter-label">
                    Items per Page:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))} className="select">
                      <option value="6">6</option>
                      <option value="12">12</option>
                      <option value="18">18</option>
                      <option value="24">24</option>
                    </select>
                  </label>
                </div>
                <p>{filteredBonds.length} results found. Showing {indexOfFirstBond + 1}–{Math.min(indexOfLastBond, filteredBonds.length)} of {filteredBonds.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar los bonos disponibles */}
        <div className="fixtures-grid">
          {currentBonds.map((fixture) => (
            <div key={fixture.fixture.id} className="fixture-card" onClick={() => handleShowModal(fixture)}>
              <div className="fixture-card-header">
                <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="team-logo" />
                <div className="vs">vs</div>
                <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="team-logo" />
              </div>
              <div className="fixture-card-body">
                <h3 className="fixture-title">{fixture.teams.home.name} vs {fixture.teams.away.name}</h3>
                <div className="fixture-time">
                  Date: {new Date(fixture.fixture.date).toLocaleString()}
                </div>

                <div className="status">
                  Status: {fixture.fixture.status.long}
                </div>

              </div>
              <div className="fixture-card-footer">
                <button className="bet-button">Reserve Bonds</button>
              </div>
            </div>
          ))}
        </div>
        

        {/* Paginación */}
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

        {/* Modal de detalles */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {selectedBond && <BondDetails fixture={selectedBond} />}
        </Modal>
      </div>
      )}
      {showHistory && (
        <div className="bet-history-page">
        <ul className="bet-list">
          {bets.map((bet, index) => (
            <li key={index} className="fixture-item">
              <div className="bet-details">
  
                {/* Mostrar detalles del fixture asociado con los mismos estilos */}
                {fixtures[bet.fixture_id] ? (
                  <div key={fixtures[bet.fixture_id].fixture.id}>
                    <div className="fixture-details">
                      <div className="team-info">
                        <div className="team home-team">
                          <img
                            src={fixtures[bet.fixture_id].teams.home.logo}
                            alt={fixtures[bet.fixture_id].teams.home.name}
                            className="team-logo"
                          />
                          <strong>{fixtures[bet.fixture_id].teams.home.name}</strong>
                        </div>
                        <div className="vs">vs</div>
                        <div className="team away-team">
                          <img
                            src={fixtures[bet.fixture_id].teams.away.logo}
                            alt={fixtures[bet.fixture_id].teams.away.name}
                            className="team-logo"
                          />
                          <strong>{fixtures[bet.fixture_id].teams.away.name}</strong>
                        </div>
                      </div>
                      <div className="fixture-time">
                        Date: {new Date(fixtures[bet.fixture_id].fixture.date).toLocaleString()}
                      </div>
                      <div className="league-info">
                        League: {fixtures[bet.fixture_id].league.name}, Round: {fixtures[bet.fixture_id].league.round}
                      </div>
                      <div className="status">
                        Status: {fixtures[bet.fixture_id].fixture.status.long}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Loading fixture details...</div>
                )}
  
                <div className="separator"></div>
  
                <div className='bets'>
                  <div className='bet-atribute'>
                    <div className="bet-amount">My odd: &nbsp;</div>
                    
                    <div className="value-gray">{bet.result}</div>
                  </div>
                  <div className='bet-atribute'>
                    <div className="bet-status">Bet status: &nbsp;</div>
                    
                    <div className="value-gray">{bet.status}</div>
                  </div>
                  <div className='bet-atribute'>
                    <div className="bet-amount">Money invested: &nbsp;</div>
                    <div className="value">${bet.quantity*1000}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
