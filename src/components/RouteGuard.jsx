import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RouteGuard = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    return !isLoggedIn ? children : null;
};

export default RouteGuard;