import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../CommonUI/Sidebar';
import SearchBar from '../CommonUI/SearchBar';
import axios from 'axios'; // Import Axios
import { darkModeStyles, lightModeStyles } from "../utils/Themes";

const LandingPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    const [items, setItems] = useState([]); // State to hold fetched items
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('/api/items'); // Fetch items from API
                setItems(response.data); // Set fetched items
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    if (loading) return <p className={`${currentModeStyles.text} p-4`}>Loading items...</p>; // Loading message

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <div className="flex flex-col flex-grow mt-16 md:ml-64">
                <div className={`flex flex-col justify-center items-center w-full py-8 ${currentModeStyles.cardBg} shadow-md`}>
                    <p className={`text-4xl ${currentModeStyles.heading} font-bold mb-6 tracking-wide`}>Visas Preces</p>
                    <SearchBar />
                </div>
                <div className="flex flex-col flex-grow overflow-y-auto md:p-6 p-2">
                    <div className="flex flex-wrap justify-start items-center md:gap-4 gap-1">
                        {items.map((ItemDetails) => (
                            <Link
                                to={`/product/${ItemDetails.id}`} // Ensure that ItemDetails.id is used correctly
                                key={ItemDetails.id}
                                className={`w-36 md:w-52 h-[240px] ${currentModeStyles.cardBg} rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl ${currentModeStyles.border} border-2`}
                            >
                                <div className={`h-[160px] ${currentModeStyles.cardBg} flex items-center justify-center overflow-hidden`}>
                                    <img
                                        src={`http://localhost:8000/storage/${ItemDetails.img}`} // Ensure that the correct path is used for the image
                                        alt={ItemDetails.name}
                                        className="h-[140px] object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div className={`h-[80px] ${currentModeStyles.cardAccent} p-3 flex flex-col justify-between`}>
                                    <p className={`font-semibold text-sm ${currentModeStyles.text} truncate tracking-tight`}>
                                        {ItemDetails.name}
                                    </p>
                                    <p className="text-xs">
                                        Pieejami noliktavā:
                                        <span className={`font-semibold ml-1 ${currentModeStyles.availableText} bg-opacity-30 px-2 py-1 rounded-full`}>
                {ItemDetails.available}
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

export default LandingPage;
