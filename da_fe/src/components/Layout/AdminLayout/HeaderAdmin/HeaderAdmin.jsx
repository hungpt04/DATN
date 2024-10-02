import React from 'react';
import { Search, Notifications } from '@mui/icons-material'; // Assuming you're using MUI icons
import avatar from '../../../Assets/avatar.jpg';
// Assuming the avatar image is in Assets folder

function HeaderAdmin() {
    const userName = 'Pham Hung'; // Replace this with dynamic data if necessary
    const userRole = 'Administrator'; // Replace this with dynamic data if necessary

    return (
        <header className="flex items-center justify-between w-full h-[70px] bg-white px-6 shadow-md">
            {/* Search Input */}
            <div className="flex items-center bg-gray-100 rounded-lg p-2 w-1/3">
                <Search className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 w-full bg-transparent outline-none text-gray-700"
                />
            </div>

            {/* Notification Bell & User Info */}
            <div className="flex items-center space-x-6">
                {/* Notification Icon */}
                <div className="relative cursor-pointer">
                    <Notifications className="text-gray-600 text-2xl" />
                    {/* You can add a notification badge here if needed */}
                </div>

                {/* User Info */}
                <div className="flex items-center">
                    <div className="mr-4 text-right">
                        <p className="text-gray-800 font-semibold">{userName}</p>
                        <p className="text-gray-500 text-sm">{userRole}</p>
                    </div>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderAdmin;
