import React, { useState, useEffect, useRef } from 'react';
import { darkModeStyles, lightModeStyles } from '../utils/Themes';

const ProductReserve = ({ onClose, onSave }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSave = () => {
        onSave({ quantity, selectedEvent });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'daudzums') {
            setQuantity(value);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(event.name);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white dark:bg-[#2D283E] rounded-lg p-6 w-[90%] md:w-[50%] max-w-lg space-y-4`}>
                <h2 className={`text-2xl font-bold mb-4 text-center ${currentModeStyles.text}`}>Rezervēt uz Pasākumu</h2>
                <form className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${currentModeStyles.text}`}>Daudzums</label>
                        <input
                            type="text"
                            name="daudzums"
                            value={quantity}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${currentModeStyles.cardBg} ${currentModeStyles.text}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${currentModeStyles.text}`}>Izvēlieties pasākumu</label>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={toggleDropdown}
                                className={`w-full ${currentModeStyles.cardBg} ${currentModeStyles.text} text-left py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-500`}
                            >
                                {selectedEvent ? selectedEvent : 'Izvēlēties pasākumu'}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#2D283E] rounded-lg shadow-lg max-h-60 overflow-auto">
                                    <ul>
                                        {Event.map((e, index) => (
                                            <li
                                                key={index}
                                                className={`py-2 px-4 ${currentModeStyles.text} hover:bg-gray-100 dark:hover:bg-[#4C495D] cursor-pointer`}
                                                onClick={() => handleEventSelect(e)}
                                            >
                                                <div className="flex items-center">
                                                    <img src={e.img} alt={e.name} className="w-12 h-12 mr-3 rounded" />
                                                    <div>
                                                        <p className="font-semibold">{e.name}</p>
                                                        <p className="text-xs">{e.from} - {e.to}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Atcelt
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Saglabāt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductReserve;
