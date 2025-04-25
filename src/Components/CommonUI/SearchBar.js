import React, { useState, useEffect } from 'react';
import { darkModeStyles, lightModeStyles } from '../utils/Themes';

const SearchBar = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
    });

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;
    const invertedInputBg = isDarkMode ? 'bg-white' : 'bg-[#1E1E1E]'; // Light background in dark mode, dark in light mode
    const invertedTextColor = isDarkMode ? 'text-[#1E1E1E]' : 'text-[#D1D7E0]'; // Dark text in dark mode, light in light mode
    const invertedPlaceholderColor = isDarkMode ? 'placeholder-[#464646]' : 'placeholder-[#D1D7E0]'; // Placeholder color adjustment

    return (
        <div>
            <form className="w-72 h-6 mx-auto">
                <label
                    htmlFor="default-search"
                    className={`text-sm font-medium ${currentModeStyles.text} sr-only`}
                >
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <img
                            src="/images/SVG/searchIcon.svg"
                            alt="Search Icon"
                            className="w-3 h-3"
                        />
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className={`block w-full p-2 ps-8 text-sm ${invertedInputBg} ${invertedTextColor} border ${currentModeStyles.border} rounded-lg ${invertedPlaceholderColor} focus:border-${currentModeStyles.border}`}
                        placeholder="Meklēt..."
                    />
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
