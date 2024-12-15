import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import logo from '../../../Assets/logo.png';
import axios from 'axios';

function Sidebar() {
    const location = useLocation();
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [vaiTro, setVaiTro] = useState(null);

    const toggleSubMenu = (index) => {
        setOpenSubMenus((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/api/tai-khoan/my-info", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setVaiTro(response.data.vaiTro);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserInfo();
        }
    }, []);

    return (
        <div className="h-screen w-[250px] bg-white fixed top-0 left-0 transition-all duration-300 shadow-lg overflow-auto pt-5">
            <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="Brand Logo" className="h-[80px] w-[60px] mr-2" />
                <span className="text-3xl font-bold text-gray-800">Backet</span>
            </div>

            <ul className="list-none p-0 m-0">
                {SidebarData.map((item) => {
                    const hasAccess = !item.vaiTro || item.vaiTro === vaiTro;

                    if (!hasAccess) {
                        return null;
                    }

                    const isActive =
                        location.pathname === item.link ||
                        (item.subItems && item.subItems.some((subItem) => subItem.link === location.pathname));

                    if (item.subItems) {
                        return (
                            <React.Fragment key={item.id || item.link}> {/* Use a unique identifier */}
                                <li
                                    className={`flex items-center h-[50px] pl-5 mb-2 cursor-pointer transition-all duration-300 ${isActive
                                        ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                        : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                        }`}
                                    onClick={() => toggleSubMenu(item.id || item.link)} // Use a unique identifier
                                >
                                    <div className="flex-[20%] text-xl">{item.icon}</div>
                                    <div className="flex-[80%] text-base">{item.title}</div>
                                </li>
                                <ul className={`list-none p-0 m-0 ${openSubMenus[item.id || item.link] ? 'block' : 'hidden'}`}>
                                    {item.subItems.map((subItem) => {
                                        const subItemActive = location.pathname === subItem.link;
                                        const subItemHasAccess = !subItem.vaiTro || subItem.vaiTro === vaiTro;

                                        return (
                                            <li
                                                className={`flex items-center h-[40px] pl-10 cursor-pointer transition-all duration-300 ${subItemActive
                                                    ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                                    : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                                    } ${!subItemHasAccess ? 'cursor-not-allowed opacity-50' : ''}`}
                                                key={subItem.id || subItem.link} // Use a unique identifier
                                            >
                                                < Link to={subItemHasAccess ? subItem.link : '#'} className="flex w-full h-full items-center">
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
                                className={`flex items-center h-[50px] pl-5 mb-2 cursor-pointer transition-all duration-300 ${isActive
                                    ? 'bg-gray-200 border-l-4 border-x-blue-800 text-gray-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                key={item.id || item.link} // Use a unique identifier
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