import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import Sidebar from "../CommonUI/Sidebar";
import { darkModeStyles, lightModeStyles } from "../utils/Themes";

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const storedMode = localStorage.getItem('isDarkMode');
        if (storedMode !== null) {
            setIsDarkMode(JSON.parse(storedMode));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    const latvianMonths = [
        'Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs',
        'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'
    ];

    // useEffect(() => {
    //     try {
    //         if (Array.isArray(eventData)) {
    //             setEvents(eventData);
    //         } else {
    //             throw new Error('Event data is not in the correct format');
    //         }
    //     } catch (err) {
    //         console.error('Error loading event data:', err);
    //         setError('Failed to load event data. Please check the data format.');
    //     }
    // }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const getEventColor = (eventId) => {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
        return colors[eventId % colors.length];
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const renderEventBars = (day) => {
        const currentDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(event => {
            const startDate = new Date(event.from);
            const endDate = new Date(event.to);
            const currentDateObj = new Date(currentDateString);
            return currentDateObj >= startDate && currentDateObj <= endDate;
        });

        // return dayEvents.map((event, index) => (
        //     <Link  // Wrap event in Link to navigate to EventDetails
        //         to={`/event/${event.id}`}  // Navigate to EventDetails page by event id
        //         key={`${event.id}-${index}`}
        //         className={`absolute left-0 right-0 h-5 ${getEventColor(event.id)} text-xs text-white truncate px-1`}
        //         style={{ top: `${index * 20 + 25}px` }}
        //     >
        //         {event.name}
        //     </Link>
        // ));
    };

    const changeMonth = (increment) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
    };

    const changeYear = (increment) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(newDate.getFullYear() + increment);
            return newDate;
        });
    };

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className={`flex min-h-screen ${currentModeStyles.background}`}>
            <Sidebar isDarkMode={isDarkMode} toggleMode={() => setIsDarkMode(!isDarkMode)} />
            <div className={`flex flex-col flex-grow ${currentModeStyles.background} mt-16 md:ml-64`}>
                <div className="p-4">
                    <h1 className={`text-2xl font-bold mb-4 text-center ${currentModeStyles.text}`}>Pasākumu kalendārs</h1>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <div className="flex mb-2 sm:mb-0">
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`mr-2 px-2 py-1 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded`}
                            >
                                <span className="hidden lg:inline">Iepriekšējais mēnesis</span>
                                <span className="lg:hidden">&lt;-Mēn</span>
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                className={`px-2 py-1 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded`}
                            >
                                <span className="hidden lg:inline">Nākamais mēnesis</span>
                                <span className="lg:hidden">Mēn-&gt;</span>
                            </button>
                        </div>
                        <div className={`${currentModeStyles.text} mb-2 sm:mb-0`}>
                            {`${latvianMonths[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        </div>
                        <div className="flex">
                            <button
                                onClick={() => changeYear(-1)}
                                className={`mr-2 px-2 py-1 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded`}
                            >
                                <span className="hidden lg:inline">Iepriekšējais gads</span>
                                <span className="lg:hidden">&lt;-Gads</span>
                            </button>
                            <button
                                onClick={() => changeYear(1)}
                                className={`px-2 py-1 ${currentModeStyles.cardBg} ${currentModeStyles.text} rounded`}
                            >
                                <span className="hidden lg:inline">Nākamais gads</span>
                                <span className="lg:hidden">Gads-&gt;</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-gray-600">
                        {['Sv', 'P', 'O', 'T', 'C', 'Pk', 'S'].map(day => (
                            <div key={day} className={`text-center font-bold ${currentModeStyles.text} ${currentModeStyles.cardBg} p-2`}>
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: firstDayOfMonth }, (_, i) => (
                            <div key={`empty-${i}`} className={`h-24 ${currentModeStyles.cardBg}`}></div>
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <div key={i + 1} className={`h-24 ${currentModeStyles.cardBg} relative overflow-hidden`}>
                                <span className={`absolute top-1 left-1 ${isToday(i + 1) ? 'text-[#0C8CE9]' : currentModeStyles.text}`}>
                                    {i + 1}
                                </span>
                                {renderEventBars(i + 1)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCalendar;
