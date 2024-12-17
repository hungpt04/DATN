import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-5 flex items-center gap-4">
            <div className="text-3xl text-blue-500">{icon}</div>
            <div className="flex-grow overflow-hidden">
                <h4 className="text-gray-500 text-sm truncate">{title}</h4>
                <p className="text-xl font-semibold truncate">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
