import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const FixtureDetailsPage = () => {
  const { fixtureId } = useParams();
  const [betOption, setBetOption] = useState('');
  const [fixtureDetails, setFixtureDetails] = useState(null); // Inicializa como null para manejar el estado de carga

  useEffect(() => {
    const fetchFixtureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/fixtures/${fixtureId}`);
        // Asegúrate de que estás accediendo a la parte correcta de la respuesta. 
        // Aquí asumimos que los detalles del fixture están directamente en response.data
        setFixtureDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching fixture details:', error);
      }
    };

    fetchFixtureDetails();
  }, [fixtureId]);

  // Función para manejar la selección de apuesta
  const handleBetSelection = (option) => {
    setBetOption(option);
  };

  // Función para manejar la colocación de la apuesta
  const handleBet = async () => {
    // Verificar si se seleccionó una opción de apuesta
    if (!betOption) {
      alert('Please select a bet option first.');
      return;
    }

    // Crear el objeto de detalles de la apuesta basado en la selección y los detalles del fixture
    const betDetails = {
      request_id: uuidv4(),
      group_id: "23",
      fixture_id: parseInt(fixtureId, 10),
      league_name: fixtureDetails.league?.name, // Asegúrate de usar el operador ?. para evitar errores si league o name no existen
      round: fixtureDetails.league?.round,
      date: new Date(fixtureDetails.fixture?.date).toLocaleString(),
      result: betOption,
      deposit_token: "", // Asume que este valor se manejará de otra forma o se actualizará más tarde
      datetime: new Date().toISOString(),
      quantity: 1,
      seller: 0
    };

    try {
        // Realizar la petición al backend
        await axios.post('http://localhost:3001/pre-validate-bet', betDetails); // Asegúrate de ajustar la URL
        alert('Bet placed successfully!');
    } catch (error) {
        console.error('Error placing bet:', error);
        alert('Error placing bet: ' + error.message);
    }
  };

  // Verificar si los detalles del fixture están cargando
  if (!fixtureDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Fixture Details</h1>
      {/* Ejemplo de cómo mostrar algunos detalles del fixture */}
      <p>League: {fixtureDetails.league?.name}</p>
      <p>Round: {fixtureDetails.league?.round}</p>
      <p>Date: {fixtureDetails.fixture?.date && new Date(fixtureDetails.fixture.date).toLocaleString()}</p>
      <p>Status: {fixtureDetails.fixture?.status?.long}</p>
      
      {/* Botones para seleccionar la opción de apuesta */}
      <div>
        <button onClick={() => handleBetSelection('Home')}>Home Win</button>
        <button onClick={() => handleBetSelection('Away')}>Away Win</button>
        <button onClick={() => handleBetSelection('Draw')}>Draw</button>
        <button onClick={handleBet}>Place Bet</button>
      </div>
    </div>
  );
};

export default FixtureDetailsPage;