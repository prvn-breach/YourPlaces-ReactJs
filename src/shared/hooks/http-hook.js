import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback( async ( url, method = 'GET', headers = {}, body = null ) => {
        setIsLoadingSpinner(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                method, 
                headers, 
                body,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response['ok']) {
                throw new Error(responseData.message);
            }
            setIsLoadingSpinner(false);
            return responseData;
        } catch (err) {
            setIsLoadingSpinner(false);
            setError(err.message || 'Something went wrong. Please try again')
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        };
    }, []);

    return { isLoadingSpinner, error, sendRequest, clearError };
};