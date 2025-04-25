import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../CommonUI/Sidebar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes"; // Import themes

export default function AddEvent() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);  // File input state
    const [nosaukums, setNosaukums] = useState('');          // Event name state
    const [datumsNo, setDatumsNo] = useState('');            // Start date state
    const [datumsLidz, setDatumsLidz] = useState('');        // End date state

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', nosaukums); // was 'nosaukums'
        formData.append('date_from', datumsNo); // was 'datums_no'
        formData.append('date_to', datumsLidz); // was 'datums_lidz'
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            // Get CSRF cookie first
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

            // Send the event data
            const response = await axios.post('/api/events', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            console.log('Event created successfully:', response.data);
        } catch (error) {
            console.error('Failed to create event:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const storedMode = localStorage.getItem('isDarkMode');
        if (storedMode) {
            setIsDarkMode(JSON.parse(storedMode));
        }
    }, []);

    // Save mode to local storage
    const toggleMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('isDarkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    // Fetch users from API using Axios


    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    // Handle file input change
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <div className={`flex flex-col flex-grow ${currentModeStyles.background} mt-16 md:ml-64`}>
                <div className={`flex flex-col justify-center items-center w-full ${currentModeStyles.cardBg} py-4`}>
                    <p className={`text-3xl ${currentModeStyles.text} font-bold mb-4`}>Pievienot pasākumu</p>
                </div>
                <div className="flex justify-center items-center flex-grow overflow-y-auto p-4">
                    <form className="w-full max-w-2xl space-y-4" onSubmit={handleSubmit}>

                        {/* Nosaukums Field */}
                        <div className="space-y-2">
                            <label htmlFor="nosaukums" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                Nosaukums:
                            </label>
                            <input
                                type="text"
                                id="nosaukums"
                                value={nosaukums}
                                onChange={(e) => setNosaukums(e.target.value)}  // Update state on input change
                                className={`w-full px-3 py-2 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-sm border ${currentModeStyles.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        {/* Date Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="datumsNo" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Datums no:
                                </label>
                                <input
                                    type="date"
                                    id="datumsNo"
                                    value={datumsNo}
                                    onChange={(e) => setDatumsNo(e.target.value)}  // Update state on input change
                                    className={`w-full px-3 py-2 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-sm border ${currentModeStyles.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="datumsLidz" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Datums līdz:
                                </label>
                                <input
                                    type="date"
                                    id="datumsLidz"
                                    value={datumsLidz}
                                    onChange={(e) => setDatumsLidz(e.target.value)}  // Update state on input change
                                    className={`w-full px-3 py-2 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-sm border ${currentModeStyles.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label htmlFor="fileUpload" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                Pasākuma attēls:
                            </label>
                            <input
                                type="file"
                                id="fileUpload"
                                onChange={handleFileChange}
                                className={`w-full ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-sm border ${currentModeStyles.border} p-2`}
                                accept="image/*"  // Accept only image files
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-gray-100'}`}
                        >
                            SAGLABĀT
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
