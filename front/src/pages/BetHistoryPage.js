import React, { useState, useEffect } from 'react';
import { getBetHistory } from '../utils/api';
import { useUser } from '../context/UserContext';
import '../styles/BetHistory.css';
import api from '../utils/api';

const BetHistoryPage = () => {
  const { user, loading } = useUser();
  const [bets, setBets] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [fixture, setFixture] = useState(null);

  useEffect(() => {
    const fetchBetHistory = async () => {
      if (!user || loading) return;

      try {
        const betHistory = await getBetHistory(user._id);
        setBets(betHistory);
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
      <h1>Your Bet History</h1>
      <ul>
        {bets.map((bet) => (
          <li key={bet.request_id} className="bet-item">
            <div className="bet-details">
              <div className="bet-league">League: {bet.league_name}</div>
              <div className="bet-round">Round: {bet.round}</div>
              <div className="bet-date">Date: {bet.date}</div>
              <div className="bet-result">My odd: {bet.result}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetHistoryPage;
