import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from "../SignUp/Logout";

const Sidebar = ({ isDarkMode, toggleMode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Visas preces', path: '/' },
        { name: 'Pieejamās preces', path: '/Available' },
        { name: 'Preces nodotas īrei', path: '/Rent' },
        { name: 'Kategorijas', path: '/Categories' },
        { name: 'Pievienot preci', path: '/AddItem' },
        { name: 'Plānotie pasākumi', path: '/PlannedEvent' },
        { name: 'Pievienot pasākumu', path: '/AddEvent' },
        { name: 'Kalendārs', path: '/Calendar' },
    ];

    const MenuItem = ({ name, path }) => (
        <li
            className={`py-2 px-4 rounded-lg transition-all duration-300 hover:bg-opacity-10 cursor-pointer ${isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-300'}`}
            onClick={() => {
                navigate(path);
                setIsOpen(false);
            }}
        >
            {name}
        </li>
    );

    const darkModeStyles = {
        background: 'bg-gradient-to-b from-[#1C1B29] to-[#39364E]',
        text: 'text-[#E3E3E3]',
        hover: 'hover:bg-white hover:bg-opacity-10',
    };

    const lightModeStyles = {
        background: 'bg-gradient-to-b from-[#F3F4F6] to-[#E8E8F1]',
        text: 'text-[#444444]',
        hover: 'hover:bg-gray-300 hover:bg-opacity-10',
    };

    const currentModeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

    return (
        <div>
            {/* Mobile Header */}
            <div className={`fixed top-0 left-0 w-screen h-16 flex justify-between items-center ${currentModeStyles.background} md:hidden z-40`}>
                <img src="/images/photos/logo.png" alt="logo" className="h-20 mt-3 md:mt-0 ml-4" />
                <img
                    src="/images/SVG/burger.svg"
                    alt="menu"
                    className="h-8 mr-4 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full ${currentModeStyles.background} p-4 z-30 w-64 hidden md:block shadow-2xl`}>
                <div className="flex items-center justify-center h-28">
                    <img src="/images/photos/logo.png" alt="logo" className="h-28" />
                </div>

                {/* Toggle Button (Now at the top) */}
                <div className="mb-6 flex justify-center">
                    <button
                        onClick={toggleMode}
                        className={`py-2 px-4 rounded-lg shadow-lg transition duration-300 ${isDarkMode ? 'bg-[#4C495D] text-[#E3E3E3]' : 'bg-[#a4adae] text-white'}`}
                    >
                        {isDarkMode ? 'Gaišais motīvs' : 'Tumšais motīvs'}
                    </button>
                </div>

                <ul className={`space-y-2 ${currentModeStyles.text} cursor-pointer mt-8`}>
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} {...item} />
                    ))}
                    <li>
                        <Logout hoverClass={currentModeStyles.hover}/>
                    </li>
                </ul>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 w-full md:w-64 h-full ${currentModeStyles.background} p-4 z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 md:hidden shadow-2xl`}
            >
                <div className="flex w-full h-16 items-center justify-center">
                    <img src="/images/photos/logo.png" alt="logo" className="h-16" />
                </div>
                <div className="mb-6 flex justify-center">
                    <button
                        onClick={toggleMode}
                        className={`py-2 px-4 rounded-lg shadow-lg transition duration-300 ${isDarkMode ? 'bg-[#4C495D] text-[#E3E3E3]' : 'bg-[#802BB1] text-white'}`}
                    >
                        {isDarkMode ? 'Gaišais motīvs' : 'Tumšais motīvs'}
                    </button>
                </div>

                <ul className={`space-y-2 ${currentModeStyles.text} mt-8`}>
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} {...item} />
                    ))}
                    <li>
                        <Logout />
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default Sidebar;
