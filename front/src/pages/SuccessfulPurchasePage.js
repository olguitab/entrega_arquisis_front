import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { commitTransaction } from '../utils/api';
import '../styles/SuccessfulPurchasePage.css';

const SuccessfulPurchasePage = () => {
    const [searchParams] = useSearchParams();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState('false')

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
        console.log(wallet);
        if (tokenWs && transactionId) {
            fetchTransactionStatus();
        } else if (wallet) {
            setLoading(false);
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
                <h1 className="error-message">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className="successful-purchase-container">
            {transactionStatus === "AUTHORIZED" ? (
                <h1 className="transaction-message success-message">Purchase Completed</h1>
            ) : transactionStatus === "PENDING" ? (
                <h1 className="transaction-message">Transaction Pending...</h1>
            ) : transactionStatus === "FAILED" ? (
                <h1 className="transaction-message error-message">Transaction Failed</h1>
            ) : transactionStatus === "CANCELED" ? (
                <h1 className="transaction-message error-message">Transaction Canceled</h1>
            ) : (
                <h1 className="transaction-message success-message">Purchase Completed</h1>
            )}
        </div>
    );
};

export default SuccessfulPurchasePage;