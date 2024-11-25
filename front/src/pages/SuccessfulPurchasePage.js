import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { commitTransaction } from '../utils/api';
import '../styles/SuccessfulPurchasePage.css';

const SuccessfulPurchasePage = () => {
    const [searchParams] = useSearchParams();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState('false');
    const [progress, setProgress] = useState(100); // Barra de progreso inicializada en 100%
    const [progressColor, setProgressColor] = useState('#e0e0e0'); // Gris por defecto
    const navigate = useNavigate(); // Para redirigir al perfil

    useEffect(() => {
        const tokenWs = searchParams.get('token_ws') || '';
        const transactionId = sessionStorage.getItem('transactionId');
        setWallet(sessionStorage.getItem('wallet'));

        const fetchTransactionStatus = async () => {
            try {
                const data = await commitTransaction(tokenWs, transactionId);
                setTransactionStatus(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tokenWs && transactionId) {
            fetchTransactionStatus();
        } else if (wallet) {
            setLoading(false);
        } else {
            setError("Faltan parámetros necesarios.");
            setLoading(false);
        }

        // Solo se debe iniciar la barra de progreso cuando la transacción está pendiente o no ha sido procesada

        if (transactionStatus === "AUTHORIZED") {
            setProgressColor('#4caf50'); // Verde para éxito
        } else if (transactionStatus === "CANCELED") {
            setProgressColor('#d56167'); // Rojo para cancelado
        } else {
            setProgressColor('#9e9e9e'); // Gris para otros casos
        }

        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress - 1.3; // Disminuye el progreso
                if (newProgress <= 0) {
                    clearInterval(timer);
                    navigate('/fixtures'); // Redirige al perfil cuando la barra llegue a 0
                    return 0;
                }
                return newProgress; // Actualiza el progreso
            });
        }, 100); // Actualiza cada 100 ms

        return () => clearInterval(timer); // Limpia el temporizador cuando el componente se desmonte




    }, [searchParams, transactionStatus, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <h1>Cargando...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h1 className="error-message">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className="successful-purchase-container">
            <div className="status-message">
                {transactionStatus === "AUTHORIZED" ? (
                    <div className="success">
                        <h1>¡Compra Completada!</h1>
                        <p>Tu compra ha sido procesada correctamente. ¡Gracias por tu compra!</p>
                    </div>
                ) : transactionStatus === "PENDING" ? (
                    <div className="pending">
                        <h1>Transacción Pendiente</h1>
                        <p>Estamos procesando tu compra. Por favor espera...</p>
                    </div>
                ) : transactionStatus === "FAILED" ? (
                    <div className="failed">
                        <h1>Transacción Fallida</h1>
                        <p>Lo sentimos, algo salió mal con tu compra. Por favor, intenta nuevamente.</p>
                    </div>
                ) : transactionStatus === "CANCELED" ? (
                    <div className="canceled">
                        <h1>Compra Cancelada</h1>
                        <p>La compra fue cancelada. Si tienes alguna duda, contacta con soporte.</p>
                    </div>
                ) : (
                    <div className="dropped">
                        <h1>Transacción Eliminada</h1>
                        <p>La transacción no fue procesada correctamente. Por favor intenta nuevamente.</p>
                    </div>
                )}

                {/* Barra de progreso con color dinámico */}
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ 
                            width: `${progress}%`,
                            backgroundColor: progressColor // Cambia el color de la barra según el estado
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SuccessfulPurchasePage;
