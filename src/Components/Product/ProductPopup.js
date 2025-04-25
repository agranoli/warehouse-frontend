import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductPopup = ({ product, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: product.name || '',
        category_id: product.category_id || '',
        count: product.quantity ?? '', // use nullish coalescing for numbers
        rentPrice: product.rentPrice ?? '',
    });
    const [preview, setPreview] = useState(product.img);
    const [photoFile, setPhotoFile] = useState(null);

    const navigate = useNavigate();

    axios.get('/api/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the categories!", error);
        });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/item/${product.id}`);
            console.log('Product deleted');
            navigate('/');
        } catch (error) {
            console.error('Kļūda dzēšot produktu:', error.response?.data || error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        if (formData.name && formData.name !== product.name) {
            updatedData.append('name', formData.name);
        }

        if (formData.category_id && formData.category_id !== product.category_id) {
            updatedData.append('category_id', formData.category_id);
        }

        if (formData.count && formData.count !== product.quantity) {
            updatedData.append('quantity', formData.count);
        }

        if (formData.rentPrice && formData.rentPrice !== product.rentPrice) {
            updatedData.append('price', formData.rentPrice);
        }

        if (photoFile) {
            updatedData.append('img', photoFile);
        }

        try {
            const response = await axios.post(
                `/api/items/${product.id}?_method=PUT`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Product updated:', response.data);
            onSave(response.data);
        } catch (error) {
            console.error('Kļūda saglabājot produktu:', error.response?.data || error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center md:justify-end lg:justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-[#2D283E] rounded-lg p-6 w-[90%] md:w-[50%] max-w-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center text-[#2D283E] dark:text-white">Rediģēt produkta informāciju</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium dark:text-white">Nosaukums</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-[#4C495D] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-white">Kategorija</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full p-2 h-[42px] appearance-none border rounded dark:bg-[#4C495D] dark:text-white"
                        >
                            <option value="">Izvēlies kategoriju</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-white">Pieejamais daudzums</label>
                        <input
                            type="number"
                            name="count"
                            value={formData.count}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-[#4C495D] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-white">Īres cena/24h</label>
                        <input
                            type="number"
                            name="rentPrice"
                            value={formData.rentPrice}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-[#4C495D] dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-white">Pievienot bildi (fails)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 w-full"
                        />
                        {preview && (
                            <div className="mt-2 hidden md:block">
                                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="md:px-4 px-2 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Atcelt
                        </button>
                        <div>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="md:px-4 px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                            >
                                Dzēst
                            </button>
                            <button
                                type="submit"
                                className="md:px-4 px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Saglabāt
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductPopup;
