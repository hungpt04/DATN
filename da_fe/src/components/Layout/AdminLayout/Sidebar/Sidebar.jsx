import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import logo from '../../../Assets/logo.png';

function Sidebar() {
    const location = useLocation(); // Get current route for active state
    const [openSubMenus, setOpenSubMenus] = useState({}); // Store open state for each submenu

    const toggleSubMenu = (index) => {
        setOpenSubMenus((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Toggle the specific submenu
        }));
    };

    return (
        <div className="h-screen w-[250px] bg-white fixed top-0 left-0 transition-all duration-300 shadow-lg overflow-auto pt-5">
            {/* Logo and Brand Name */}
            <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="Brand Logo" className="h-[80px] w-[60px] mr-2" />
                <span className="text-3xl font-bold text-gray-800">Backet</span>
            </div>

            <ul className="list-none p-0 m-0">
                {SidebarData.map((item, index) => {
                    const isActive =
                        location.pathname === item.link ||
                        (item.subItems && item.subItems.some((subItem) => subItem.link === location.pathname));

                    if (item.subItems) {
                        return (
                            <React.Fragment key={index}>
                                <li
                                    className={`flex items-center h-[50px] pl-5 mb-2 cursor-pointer transition-all duration-300 ${
                                        isActive
                                            ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                            : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                    onClick={() => toggleSubMenu(index)} // Use index to track which submenu is toggled
                                >
                                    <div className="flex-[20%] text-xl">{item.icon}</div>
                                    <div className="flex-[80%] text-base">{item.title}</div>
                                </li>
                                <ul className={`list-none p-0 m-0 ${openSubMenus[index] ? 'block' : 'hidden'}`}>
                                    {item.subItems.map((subItem, subIndex) => {
                                        const subItemActive = location.pathname === subItem.link;
                                        return (
                                            <li
                                                className={`flex items-center h-[40px] pl-10 cursor-pointer transition-all duration-300 ${
                                                    subItemActive
                                                        ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                                        : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                                }`}
                                                key={subIndex}
                                            >
                                                <Link to={subItem.link} className="flex w-full h-full items-center">
                                                    <div className="text-sm">{subItem.title}</div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <li
                                className={`flex items-center h-[50px] pl-5 mb-2 cursor-pointer transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                        : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                                key={index}
                            >
                                <Link to={item.link} className="flex w-full h-full items-center">
                                    <div className="flex-[20%] text-xl">{item.icon}</div>
                                    <div className="flex-[80%] text-base">{item.title}</div>
                                </Link>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
}

export default Sidebar;
