import React, { useEffect, useState } from 'react';
import { getTotalBondsAvailable, purchaseBond, getRecommendations } from '../utils/api';

const AdminPanelPage = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBonds = async () => {
      try {
        setLoading(true);
        const data = await getTotalBondsAvailable(/* fixture_id opcional */);
        setBonds(data);
      } catch (error) {
        console.error('Error fetching bonds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonds();
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {Array.isArray(bonds) ? (
            bonds.map((bond) => (
              <li key={bond.id}>
                {bond.name} - {bond.quantity} disponibles
              </li>
            ))
          ) : (
            <p>No hay bonos disponibles</p>
          )}
        </ul>
      )}
    </div>
  );
  
};

export default AdminPanelPage;
