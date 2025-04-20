import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Logout = ({ hoverClass }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            await axios.post('/logout', {}, { withCredentials: true });
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button
            className={`absolute bottom-5 left-5 py-2 px-4 rounded-lg transition-all duration-300 ${hoverClass}`}
            onClick={handleLogout}
        >
            Iziet
        </button>
    );
};

export default Logout;
