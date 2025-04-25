import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../CommonUI/Sidebar';
import { darkModeStyles, lightModeStyles } from '../utils/Themes';
import EventEdit from './EventEdit';

const EventDetails = () => {
    const { id } = useParams();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [event, setEvent] = useState(null);
    const [showEventPopup, setShowEventPopup] = useState(false);

    useEffect(() => {
        const storedMode = localStorage.getItem('isDarkMode');
        if (storedMode !== null) {
            setIsDarkMode(JSON.parse(storedMode));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        axios.get(`/api/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error('Kļūda ielādējot pasākumu:', err));
    }, [id]);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    if (!event) {
        return (
            <div className={`flex min-h-screen ${currentModeStyles.background}`}>
                <Sidebar isDarkMode={isDarkMode} toggleMode={() => setIsDarkMode(!isDarkMode)} />
                <div className="p-8 text-xl font-semibold text-center w-full">
                    <p className={currentModeStyles.text}>Notiek ielāde...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={() => setIsDarkMode(!isDarkMode)} />
            <div className={`flex flex-col flex-grow ${currentModeStyles.background}  md:ml-64 p-4 overflow-hidden`}>
                <div className="flex flex-col h-full items-center justify-evenly">
                    <div className={`flex flex-col justify-center items-center w-full py-8 ${currentModeStyles.cardBg} shadow-md`}>
                        <p className={`text-3xl ${currentModeStyles.text} text-center font-bold mb-4`}>Pasākuma informācija</p>
                    </div>
                    <div className="flex flex-col md:flex-row w-full justify-center items-center">
                        <div className="md:h-[300px] md:w-1/3 w-full p-4 flex flex-col items-center">
                            <img src={`${event.file}`} alt={event.name} className="w-full h-auto rounded-sm" />
                            <button
                                onClick={() => setShowEventPopup(true)}
                                className={`w-full px-4 mt-5 py-2 ${currentModeStyles.cardAccent} text-white rounded-md hover:bg-blue-700`}
                            >
                                LABOT INFORMĀCIJU
                            </button>
                        </div>

                        <div className="md:w-2/3 w-full p-4 space-y-4">
                            <div className="space-y-2">
                                <p className={`text-4xl ${currentModeStyles.text} font-bold`}>{event.name}</p>
                                <div className={`text-base ${currentModeStyles.text}`}>
                                    <p>Pasākuma datums:</p>
                                    <p>No: {event.from}</p>
                                    <p>Līdz: {event.to}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className={`${currentModeStyles.border} bg-gray-50`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprīkojums</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daudzums</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {event.reservedEquipment?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEventPopup && (
                <EventEdit
                    event={event}
                    onClose={() => setShowEventPopup(false)}
                    onSave={(updatedEvent) => {
                        setEvent(updatedEvent);
                        setShowEventPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default EventDetails;
