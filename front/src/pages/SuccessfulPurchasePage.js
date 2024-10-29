import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { commitTransaction } from '../utils/api';

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
        if (tokenWs && transactionId ) {
            fetchTransactionStatus();
        } else if (wallet){
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
                <h1>Error: {error}</h1>
            </div>
        );
    }

    return (
    <>
    { transactionStatus === "AUTHORIZED" ? 
        (<div className="p-8 mt-20 flex flex-col gap-3 w-1/3 mx-auto rounded-xl shadow-[0_0px_8px_#b4b4b4]">
            <h1 className="text-center">Purchase Completed</h1>
        </div>) :
        (<div className="p-8 mt-20 flex flex-col gap-3 w-1/3 mx-auto rounded-xl shadow-[0_0px_8px_#b4b4b4]">
            <h1 className="text-center">{transactionStatus}</h1>
        </div>)
    }
    </>
    );
};

export default SuccessfulPurchasePage;
