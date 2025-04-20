import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "../CommonUI/Sidebar";
import SearchBar from "../CommonUI/SearchBar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes";

const Available = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    const [availableItems, setAvailableItems] = useState([]);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        axios.get('/api/available-items') // 👈 Change to your actual endpoint
            .then(res => setAvailableItems(res.data))
            .catch(err => console.error('Kļūda ielādējot datus:', err));
    }, []);

    const toggleMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <div className="flex flex-col flex-grow mt-16 md:ml-64">
                <div className={`flex flex-col justify-center items-center w-full py-8 ${currentModeStyles.cardBg} shadow-md`}>
                    <p className={`text-3xl ${currentModeStyles.heading} font-bold mb-4`}>Pieejamās preces</p>
                    <SearchBar />
                </div>
                <div className="flex flex-col flex-grow overflow-y-auto md:p-6 p-2">
                    <div className="flex flex-wrap justify-start items-center md:gap-4 gap-1">
                        {availableItems.map(item => (
                            <Link
                                to={`/product/${item.id}`}
                                key={item.id}
                                className={`w-36 md:w-52 h-[240px] ${currentModeStyles.cardBg} rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl ${currentModeStyles.border} border-2`}
                            >
                                <div className={`h-[160px] ${currentModeStyles.cardBg} flex items-center justify-center overflow-hidden`}>
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div className={`h-[80px] ${currentModeStyles.cardAccent} p-3 flex flex-col justify-between`}>
                                    <p className={`font-semibold text-sm ${currentModeStyles.text} truncate tracking-tight`}>
                                        {item.name}
                                    </p>
                                    <p className="text-xs">
                                        Pieejami noliktavā:
                                        <span className={`font-semibold ml-1 ${currentModeStyles.availableText} bg-opacity-30 px-2 py-1 rounded-full`}>
                                            {item.available}
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Available;
