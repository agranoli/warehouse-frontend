import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../CommonUI/Sidebar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes";

export default function AddItem() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("isDarkMode") === "true";
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const toggleMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("isDarkMode", newMode);
            return newMode;
        });
    };

    useEffect(() => {
        localStorage.setItem("isDarkMode", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Lūdzu, izvēlieties attēlu.");
            return;
        }

        const formData = new FormData();
        formData.append('name', itemName);
        formData.append('category_id', selectedCategory);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('img', imageFile);

        try {
            const response = await axios.post('/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Item added successfully:', response.data);

            // Clear the form fields on success
            setItemName('');
            setSelectedCategory('');
            setQuantity('');
            setPrice('');
            setImageFile(null); // Clear the image
        } catch (error) {
            if (error.response) {
                console.error('Validation Error:', error.response.data);
            } else {
                console.error('Error adding item:', error.message);
            }
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            alert("Lūdzu, izvēlieties derīgu attēla failu.");
            setImageFile(null);
        }
    };

    // Function to create image URL for preview
    const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : '';

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar toggleMode={toggleMode} isDarkMode={isDarkMode} />
            <div className="flex flex-col flex-grow mt-16 md:ml-64">
                <div className={`flex flex-col justify-center items-center w-full py-8 ${currentModeStyles.cardBg} shadow-md`}>
                    <p className={`text-3xl ${currentModeStyles.heading} font-bold mb-4`}>Pievienot preci</p>
                </div>
                <div className="flex flex-col flex-grow overflow-y-auto p-4 mt-0 md:mt-24 items-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="nosaukums" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                Nosaukums:
                            </label>
                            <input
                                type="text"
                                id="nosaukums"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className={`w-full px-3 py-2 border ${currentModeStyles.border} ${currentModeStyles.text} rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="kategorija" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Kategorija:
                                </label>
                                <select
                                    id="kategorija"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className={`w-full px-3 py-2 border ${currentModeStyles.border} ${currentModeStyles.text} rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                >
                                    <option value="">Izvēlēties kategoriju</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="daudzums" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Daudzums:
                                </label>
                                <input
                                    type="number"
                                    id="daudzums"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className={`w-full px-3 py-2 border ${currentModeStyles.border} ${currentModeStyles.text} rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cena" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Cena/24h:
                                </label>
                                <input
                                    type="number"
                                    id="cena"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`w-full px-3 py-2 border ${currentModeStyles.border} ${currentModeStyles.text} rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="bilde" className={`block text-sm font-medium ${currentModeStyles.text}`}>
                                    Pievienot bildi (failu):
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={`w-full rounded-sm border ${currentModeStyles.border} ${currentModeStyles.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-gray-100'}`}
                        >
                            SAGLABĀT
                        </button>
                    </form>
                    {imageFile && (
                        <div className="mt-4">
                            <p className={`text-sm font-medium ${currentModeStyles.text}`}>Attēla priekšskatījums:</p>
                            <img src={imagePreviewUrl} alt="Image Preview" className="mt-2 w-48 h-auto border rounded-md shadow-sm" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
