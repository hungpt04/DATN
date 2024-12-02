import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-5 flex items-center gap-4">
            <div className="text-3xl text-blue-500">{icon}</div>
            <div>
                <h4 className="text-gray-500 text-sm">{title}</h4>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
