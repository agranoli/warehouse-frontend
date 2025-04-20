import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import Sidebar from "../CommonUI/Sidebar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes";

const Categories = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });
    const [categories, setCategories] = useState([]);  // State to store fetched categories
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null); // Track the currently expanded category
    const [items, setItems] = useState([]); // Store all items

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Fetch categories and items when the component loads
    useEffect(() => {
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
            });

        axios.get('/api/items')  // Adjust endpoint as needed
            .then(response => {
                setItems(response.data); // Store all items for filtering
            })
            .catch(error => {
                console.error("There was an error fetching the items!", error);
            });
    }, []);

    const toggleMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    const handleSave = () => {
        // Save category via API
        axios.post('/api/categories', { name: categoryName })
            .then(response => {
                setCategories([...categories, response.data.category]);
                setCategoryName('');  // Clear the input field
                setIsPopupOpen(false);
            })
            .catch(error => {
                console.error('There was an error saving the category!', error);
            });
    };

    return (
        <div className={`min-h-screen flex ${currentModeStyles.background} text-[#D0DFE5] p-6 flex-col`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={toggleMode} />
            <div className='flex flex-col flex-grow mt-16 md:ml-64'>
                <div className={`flex flex-col justify-center items-center w-full py-4 ${currentModeStyles.cardBg}`}>
                    <h1 className={`text-3xl font-bold mb-4 ${currentModeStyles.heading}`}>Kategorijas</h1>
                </div>
                <div className="w-full max-w-lg mx-auto mt-10">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-gray-100'}`}>
                        Pievienot Kategoriju
                    </button>
                    {categories.map((category) => (
                        <div key={category.id} className="mb-4">
                            <button
                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                className={`w-full ${currentModeStyles.cardBg} ${currentModeStyles.text} text-left py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-500`}>
                                {category.name}
                            </button>
                            {expandedCategory === category.id && (
                                <ul className="ml-6 mt-2 flex flex-col justify-between">
                                    {items
                                        .filter(item => item.category === category.name) // Filter items by category name
                                        .map(item => (
                                            <li key={item.id}
                                                className={`flex items-center justify-start text-right text-wrap ${currentModeStyles.text} py-2 border-b border-gray-300`}>
                                                <img
                                                    src={`/storage/${item.img}`} // Construct the full path to the image
                                                    alt={item.name}
                                                    className="h-[70px] rounded-sm p-1"
                                                />
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    ))}
                    {isPopupOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className={`w-full max-w-md p-6 rounded-lg ${currentModeStyles.cardBg} shadow-lg`}>
                                <h2 className={`text-2xl font-bold mb-4 ${currentModeStyles.heading}`}>Pievienot Kategoriju</h2>
                                <label className={`block mb-2 ${currentModeStyles.text}`}>Nosaukums:</label>
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className={`w-full p-2 mb-4 rounded-lg ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} ${currentModeStyles.cardBg} ${currentModeStyles.text} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setIsPopupOpen(false)}
                                        className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                                    >
                                        Atcelt
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Saglabāt
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
