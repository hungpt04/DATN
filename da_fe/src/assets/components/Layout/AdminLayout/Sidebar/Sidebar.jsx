import React from 'react';
import './Sidebar.css';
import { SidebarData } from './SidebarData';


function Sidebar() {
    return (
        <div className="Sidebar">
            <ul className='SidebarList'>
                {SidebarData.map((item, index) => {
                    return (
                        <li 
                        className='row'
                        // id={window.location.pathname = item.link ? "active" : ""}
                        key={index} 
                        onClick={() => {window.location.pathname = item.link}}>
                            {""}
                            <div id='icon'>{item.icon}</div>{""}
                            <div id='title'>{item.title}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default Sidebar;
