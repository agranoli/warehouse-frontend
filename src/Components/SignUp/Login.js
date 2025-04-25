import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isTokenReady, setIsTokenReady] = useState(false);

    // Pārliecinās, ka CSRF tokens ir iestatīts pirms pieslēgšanās
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
                setIsTokenReady(true);
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
            }
        };

        fetchCsrfToken();
    }, []);

    // Apstrādā pieslēgšanās darbību
    const handleLogin = async () => {
        if (!isTokenReady) return;

        try {
            const response = await axios.post('/login', {
                email,
                password
            }, { withCredentials: true });

            if (response.status === 200) {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Nepareizs e-pasts vai parole. Lūdzu, mēģiniet vēlreiz.');
        }
    };

    // Pieslēgšanās forma
    return (
        <div className="w-full h-screen flex bg-[#1e1e1e] flex-col">
            <div className="h-1/5 w-full flex justify-center items-center">
                <img src="/images/photos/logo.png" alt="logo" className="flex h-24" />
            </div>
            <div className="h-2/3 w-full justify-evenly items-center flex flex-col">
                <div className="flex font-bold text-3xl w-full text-white justify-center items-center">
                    <p>PIESLĒGTIES</p>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="h-1/2 justify-evenly items-center flex flex-col">
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="email"
                            placeholder="IEVADIET E-PASTU"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="password"
                            placeholder="IEVADIET PAROLI"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div
                        className="flex cursor-pointer w-72 h-12 bg-[#464646] drop-shadow rounded text-center justify-center items-center"
                        onClick={handleLogin}
                    >
                        <p className="flex text-[#D0DFE5] text-base font-light">PIESLĒGTIES</p>
                    </div>
                </div>
                <div className="flex flex-col w-full h-1/5 justify-end items-center">
                    <p className="flex font-light text-[#D0DFE5] text-base">Jums nav izveidots konts?</p>
                    <p className="flex cursor-pointer font-light text-[#0C8CE9] text-base"
                       onClick={() => navigate('/register')}>Reģistrēties</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
