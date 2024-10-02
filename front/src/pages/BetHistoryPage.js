import React, { useState, useEffect } from 'react';
import { getBetHistory } from '../utils/api'; // Nueva función que hará la solicitud de historial
import '../styles/BetHistory.css';

const BetHistoryPage = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const betHistory = await getBetHistory();
        setBets(betHistory);
      } catch (err) {
        setError('Error fetching bet history');
      } finally {
        setLoading(false);
      }
    };

    fetchBetHistory();
  }, []);

  if (loading) {
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
              <div className="bet-date">Date: {new Date(bet.date).toLocaleString()}</div>
              <div className="bet-result">Result: {bet.result}</div>
              <div className={`bet-status ${bet.won ? 'won' : 'lost'}`}>
                {bet.won ? 'Won' : 'Lost'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetHistoryPage;
