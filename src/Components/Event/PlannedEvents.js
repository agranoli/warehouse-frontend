// PlannedEvents.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../CommonUI/Sidebar";
import SearchBar from "../CommonUI/SearchBar";
import { darkModeStyles, lightModeStyles } from '../utils/Themes';

const PlannedEvents = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    useEffect(() => {
        axios.get('/api/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('Kļūda ielādējot pasākumus:', error);
            });
    }, []);

    const handleEventClick = (id) => {
        navigate(`/event/${id}`);
    };

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <div className="flex flex-col flex-grow mt-16 md:ml-64">
                <div className={`flex flex-col justify-center items-center w-full py-8 ${currentModeStyles.cardBg} shadow-md`}>
                    <p className={`text-3xl ${currentModeStyles.heading} font-bold mb-4`}>Plānotie pasākumi</p>
                    <SearchBar />
                </div>
                <div className="flex flex-col flex-grow overflow-y-auto md:p-6 p-2">
                    <div className="flex flex-wrap justify-start items-center md:gap-4 gap-1">
                        {events.map(event => (
                            <div
                                key={event.id}
                                className={`w-36 md:w-52 h-[240px] ${currentModeStyles.cardBg} rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl ${currentModeStyles.border} border-2 cursor-pointer`}
                                onClick={() => handleEventClick(event.id)}
                            >
                                <div className={`h-[160px] ${currentModeStyles.cardBg} flex items-center justify-center overflow-hidden`}>
                                    <img
                                        src={`${event.file}`}
                                        alt={event.name}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div
                                    className={`h-[80px] ${currentModeStyles.cardAccent} p-3 flex flex-col justify-between`}>
                                    <p className={`font-semibold text-sm ${currentModeStyles.text} truncate tracking-tight text-wrap`}>
                                        {event.name}
                                    </p>
                                    <p className="text-xs text-white">
                                        No: {event.date_from}
                                    </p>
                                    <p className="text-xs text-white">
                                        Līdz: {event.date_to}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlannedEvents;
