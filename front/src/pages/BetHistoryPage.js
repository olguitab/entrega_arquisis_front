import React, { useState, useEffect } from 'react';
import { getBetHistory, getFixture } from '../utils/api';
import { useUser } from '../context/UserContext';
import '../styles/BetHistory.css';

const BetHistoryPage = () => {
  const { user, loading } = useUser();
  const [bets, setBets] = useState([]);
  const [fixtures, setFixtures] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading || loadingHistory) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="bet-history-page">
      <div className='gradient-h1'>My Bet History</div>
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
                  <div className="bet-amount">Money invested: &nbsp;</div>
                  <div className="value">${bet.quantity*1000}</div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetHistoryPage;
