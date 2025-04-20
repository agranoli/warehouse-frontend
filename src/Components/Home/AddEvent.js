import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../CommonUI/Sidebar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes"; // Import themes

export default function AddEvent() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);  // File input state
    const [allUsers, setAllUsers] = useState([]);            // List of all users
    const [selectedUsers, setSelectedUsers] = useState([]);  // List of selected users
    const [nosaukums, setNosaukums] = useState('');          // Event name state
    const [datumsNo, setDatumsNo] = useState('');            // Start date state
    const [datumsLidz, setDatumsLidz] = useState('');        // End date state

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nosaukums', nosaukums);
        formData.append('datums_no', datumsNo);
        formData.append('datums_lidz', datumsLidz);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        formData.append('users', selectedUsers.map(user => user.id));

        try {
            const response = await fetch('/events', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Event created successfully');
            } else {
                console.error('Failed to create event');
            }
        } catch (error) {
            console.error('Error:', error);
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
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');  // Adjust API endpoint as needed
                setAllUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    // Handle file input change
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle adding selected users
    const handleUserSelect = (e) => {
        const selectedId = parseInt(e.target.value);
        const selectedUser = allUsers.find(user => user.id === selectedId);

        // Only add if the user isn't already selected
        if (selectedUser && !selectedUsers.some(user => user.id === selectedId)) {
            setSelectedUsers([...selectedUsers, selectedUser]);
        }
    };

    // Handle removing a selected user
    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
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
                                    type="text"
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
                                    type="text"
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

                        {/* Dropdown for Users */}
                        <div className="space-y-2">
                            <label htmlFor="userSelect" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                Izvēlieties Darbiniekus:
                            </label>
                            <select
                                id="userSelect"
                                onChange={handleUserSelect}
                                className={`w-full ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-sm border ${currentModeStyles.border} p-2`}
                                value=""  // Ensure it resets after each selection
                            >
                                <option value="" disabled hidden>Izvēlieties lietotāju</option>
                                {allUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Display Selected Users */}
                        {selectedUsers.length > 0 && (
                            <div className="space-y-2">
                                <p className={`text-sm ${currentModeStyles.text}`}>Izvēlētie lietotāji:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded-full px-3 py-1 border ${currentModeStyles.border}`}
                                        >
                                            <span>{user.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="ml-2 text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
