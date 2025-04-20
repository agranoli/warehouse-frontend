import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {

        // Check for empty fields
        if (!name) {
            setError('Lūdzu ievadiet vārdu un uzvārdu'); // "Please enter your name"
            return;
        }
        if (!email) {
            setError('Lūdzu ievadiet e-pasta adresi'); // "Please enter your email address"
            return;
        }
        if (!password) {
            setError('Lūdzu ievadiet paroli'); // "Please enter your password"
            return;
        }
        if (!confirmPassword) {
            setError('Lūdzu apstipriniet paroli'); // "Please confirm your password"
            return;
        }

        // Check for valid email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Lūdzu ievadiet derīgu e-pasta adresi'); // "Please enter a valid email address"
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Paroles nesakrīt'); // "Passwords do not match"
            return;
        }

        try {
            // Get CSRF cookie for Sanctum
            await axios.get('/sanctum/csrf-cookie', {
                withCredentials: true
            });
            // Register the user
            const registerResponse = await axios.post(
                '/register',
                {
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword
                }
            );

            if (registerResponse.status === 204) {
                navigate('/');
            } else {
                setError('Reģistrācija neizdevās. Lūdzu, mēģiniet vēlreiz.'); // "Registration failed. Please try again."
            }
        } catch (err) {
            console.error('Registration error:', err);

            if (err.response) {
                console.error('Status:', err.response.status);
                console.error('Data:', err.response.data);
                setError(`Reģistrācijas kļūda: ${err.response.status}`);
            } else {
                setError('Nevar izveidot savienojumu ar serveri.');
            }
        }
    };

    return (
        <div className="w-full h-screen flex bg-[#1e1e1e] flex-col">
            <div className="h-1/5 w-full flex justify-center items-center">
                <img src="/images/photos/logo.png" alt="logo" className="flex h-24" />
            </div>
            <div className="h-3/4 w-full justify-evenly items-center flex flex-col">
                <div className="flex font-bold text-3xl w-full text-white justify-center items-center">
                    <p>REĢISTRĒTIES</p>
                </div>
                <div className="h-3/4 justify-evenly items-center flex flex-col">
                    {/* Name input */}
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="text"
                            placeholder="VĀRDS, UZVĀRDS"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    {/* Email input */}
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="email"
                            placeholder="IEVADIET E-PASTU"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Password input */}
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="password"
                            placeholder="IEVADIET PAROLI"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Confirm password input */}
                    <div className="flex w-72 h-12 border border-[#464646] drop-shadow rounded text-left items-center">
                        <input
                            className="flex text-[#D0DFE5] font-bold text-xs bg-transparent border-none focus:outline-none w-full px-2"
                            type="password"
                            placeholder="APSTIPRINIET PAROLI"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                    <div
                        className="flex cursor-pointer w-72 h-12 bg-[#464646] drop-shadow rounded text-center justify-center items-center"
                        onClick={handleRegister}
                    >
                        <p className="flex text-[#D0DFE5] text-base font-light">REĢISTRĒTIES</p>
                    </div>
                </div>
                <div className="flex flex-col w-full h-1/5 justify-end items-center">
                    <p className="flex font-light text-[#D0DFE5] text-base">Jums jau ir izveidots konts?</p>
                    <p
                        className="flex cursor-pointer font-light text-[#0C8CE9] text-base"
                        onClick={() => navigate('/login')}
                    >
                        Pieslēgties
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
