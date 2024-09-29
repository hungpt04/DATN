import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

function Sidebar() {
    const [subMenuOpen, setSubMenuOpen] = useState(false); // Trạng thái cho menu con

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen); // Đổi trạng thái khi click vào "Quản lý sản phẩm"
    };

    return (
        <div className="h-screen w-[250px] bg-gray-800 fixed top-0 left-0 transition-all duration-300 shadow-lg overflow-auto pt-5">
            <ul className="list-none p-0 m-0">
                {SidebarData.map((item, index) => {
                    if (item.subItems) {
                        return (
                            <React.Fragment key={index}>
                                <li
                                    className={`flex items-center h-[50px] pl-5 mb-2 text-gray-200 cursor-pointer rounded-lg transition-all duration-300 ${
                                        subMenuOpen
                                            ? 'bg-gray-700 pl-6 text-teal-500'
                                            : 'hover:bg-gray-700 hover:pl-6 hover:text-teal-500'
                                    }`}
                                    onClick={toggleSubMenu} // Đổi trạng thái khi click
                                >
                                    <div className="flex-[20%] text-xl">{item.icon}</div>
                                    <div className="flex-[80%] text-base">{item.title}</div>
                                </li>
                                <ul className={`list-none p-0 m-0 ${subMenuOpen ? 'block' : 'hidden'}`}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li
                                            className="flex items-center h-[40px] pl-10 text-gray-400 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:text-teal-500"
                                            key={subIndex}
                                        >
                                            <Link to={subItem.link} className="flex w-full h-full items-center">
                                                <div className="text-sm">{subItem.title}</div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <li
                                className="flex items-center h-[50px] pl-5 mb-2 text-gray-200 cursor-pointer rounded-lg transition-all duration-300 hover:bg-gray-700 hover:pl-6 hover:text-teal-500"
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
