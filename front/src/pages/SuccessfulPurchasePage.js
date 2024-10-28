import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { commitTransaction } from '../utils/api'; // Asegúrate de que la ruta sea correcta

const SuccessfulPurchasePage = () => {
    const [searchParams] = useSearchParams();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const tokenWs = searchParams.get('token_ws') || '';
        const transactionId = sessionStorage.getItem('transactionId'); // Asegúrate de que este ID está disponible

        const fetchTransactionStatus = async () => {
            try {
                const data = await commitTransaction(tokenWs, transactionId);
                setTransactionStatus(data.estado); // Suponiendo que 'estado' es un campo en la respuesta
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tokenWs && transactionId) {
            fetchTransactionStatus();
        } else {
            setError("Faltan parámetros necesarios.");
            setLoading(false);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="p-20">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-20">
                <h1>Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className="p-8 mt-20 flex flex-col gap-3 w-1/3 mx-auto rounded-xl shadow-[0_0px_8px_#b4b4b4]">
            <h1 className="text-center">Purchase Completed</h1>
            <p>Estado de la transacción: {transactionStatus}</p>
        </div>
    );
};

export default SuccessfulPurchasePage;
