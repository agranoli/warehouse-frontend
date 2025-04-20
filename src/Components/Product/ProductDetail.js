import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import Sidebar from '../CommonUI/Sidebar';
import { darkModeStyles, lightModeStyles } from '../utils/Themes';
import ProductPopup from './ProductPopup';
import ProductReserve from './ProductReserve';
import ProductRent from './ProductRent';

const ProductDetail = () => {
    const { id } = useParams();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [product, setProduct] = useState(null); // For fetched product data
    const [showProductPopup, setShowProductPopup] = useState(false);
    const [showReservePopup, setShowReservePopup] = useState(false);
    const [showRentPopup, setShowRentPopup] = useState(false);

    // Load dark mode state from local storage
    useEffect(() => {
        const storedMode = localStorage.getItem('isDarkMode');
        if (storedMode !== null) {
            setIsDarkMode(JSON.parse(storedMode));
        }
    }, []);

    // Persist dark mode state in local storage
    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    // Fetch product data by ID using Axios
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/items/${id}`);
                console.log('Fetched product:', response.data); // Check the product data structure
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error.response || error);
            }
        };
        fetchProduct();
    }, [id]);

    // If product data is not fetched yet, show a loading message
    if (!product) {
        return <p className={`${currentModeStyles.text} p-4`}>Produkta informācija netika atrasta</p>;
    }

    const handleEditClick = () => {
        setShowProductPopup(true);
    };

    const handleReserveClick = () => {
        setShowReservePopup(true);
    };

    const handleRentClick = () => {
        setShowRentPopup(true);
    };

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={() => setIsDarkMode(!isDarkMode)} />
            <div className={`flex flex-col flex-grow ${currentModeStyles.background} mt-16 md:ml-64 p-4 overflow-hidden justify-between`}>
                <div className="flex flex-col h-full items-center justify-evenly">
                    <p className={`text-3xl ${currentModeStyles.text} text-center font-bold mb-4`}>Produkta informācija</p>
                    <div className="flex flex-col md:flex-row w-full md:w-auto h-full md:h-auto justify-center items-center">
                        {/* Product Image and Edit Button */}
                        <div className="md:w-1/3 w-full h-auto p-4 flex flex-col items-center">
                            {/* Adjust image URL based on the storage directory */}
                            <img
                                src={`/storage/${product.img}`} // Assuming the backend stores images in 'public/storage'
                                alt={product.name}
                                className="w-full h-auto rounded-sm"
                            />
                            <button
                                type="button"
                                onClick={handleEditClick}
                                className={`w-full px-4 mt-5 py-2 ${currentModeStyles.cardAccent} text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                            >
                                LABOT INFORMĀCIJU
                            </button>
                        </div>

                        {/* Product Details */}
                        <div
                            className="md:w-1/3 w-full justify-between md:h-[462px] h-[400px] -mt-2 p-4 space-y-1 md:space-y-4 flex flex-col">
                            <div className="flex flex-col space-y-2">
                                <p className={`text-4xl ${currentModeStyles.text} font-bold`}>{product.name}</p>
                                {/* Directly display the category */}
                                <p className={`text-base ${currentModeStyles.text}`}>
                                    {product.category ? product.category : "Kategorija netika atrasta"}
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <p className={`text-sm ${currentModeStyles.text}`}>Nodots īrē līdz: </p>
                                <p className={`text-sm ${currentModeStyles.text}`}>Pieejami noliktavā: {product.available !== null ? product.available : "Not available"}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <p className={`text-sm ${currentModeStyles.text}`}>Īrē nodevis: *vārds, uzvārds*</p>
                                <p className={`text-sm ${currentModeStyles.text}`}>Rezervēts uz: *pasākuma nosaukums*</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex w-full justify-center space-x-3">
                                <button
                                    type="button"
                                    onClick={handleRentClick}
                                    className={`w-1/2 px-4 h-[40px] ${currentModeStyles.cardAccent} text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-xs`}
                                >
                                    NODOT ĪREI
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReserveClick}
                                    className={`w-1/2 px-4 h-[40px] ${currentModeStyles.cardAccent} text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-xs`}
                                >
                                    REZERVĒT UZ PASĀKUMU
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Popups */}
            {showProductPopup && (
                <ProductPopup
                    product={product} // Pass the fetched product to the popup
                    onClose={() => setShowProductPopup(false)}
                    onSave={(updatedProduct) => {
                        console.log('Product updated:', updatedProduct);
                        setShowProductPopup(false);
                    }}
                />
            )}

            {showReservePopup && (
                <ProductReserve
                    onClose={() => setShowReservePopup(false)}
                    onSave={(reserveData) => {
                        console.log('Reserve data:', reserveData);
                        setShowReservePopup(false);
                    }}
                />
            )}

            {showRentPopup && (
                <ProductRent
                    onClose={() => setShowRentPopup(false)}
                    onSave={(rentData) => {
                        console.log('Rent data:', rentData);
                        setShowRentPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default ProductDetail;
