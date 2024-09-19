import React, { useState } from 'react';
import './Sidebar.css';
import { SidebarData } from './SidebarData';

function Sidebar() {
    const [subMenuOpen, setSubMenuOpen] = useState(false); // Trạng thái cho menu con

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen); // Đổi trạng thái khi click vào "Quản lý sản phẩm"
    };

    return (
        <div className="Sidebar">
            <ul className='SidebarList'>
                {SidebarData.map((item, index) => {
                    if (item.subItems) {
                        return (
                            <React.Fragment key={index}>
                                <li 
                                    className={`row ${subMenuOpen ? "show-submenu" : ""}`} 
                                    onClick={toggleSubMenu} // Đổi trạng thái khi click
                                >
                                    <div id='icon'>{item.icon}</div>
                                    <div id='title'>{item.title}</div>
                                    <div className="toggle-icon">{subMenuOpen ? "▼" : "▶"}</div> {/* Icon mũi tên */}
                                </li>
                                <ul className='SubMenu' style={{ display: subMenuOpen ? 'block' : 'none' }}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li 
                                            className='sub-row' 
                                            key={subIndex}
                                            onClick={() => { window.location.pathname = subItem.link }}
                                        >
                                            <div id='sub-title'>{subItem.title}</div>
                                        </li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <li 
                                className='row'
                                key={index}
                                onClick={() => { window.location.pathname = item.link }}
                            >
                                <div id='icon'>{item.icon}</div>
                                <div id='title'>{item.title}</div>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
}

export default Sidebar;
