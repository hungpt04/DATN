import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="p-5 flex items-center gap-4">
            {/* <div className="text-3xl text-blue-500">{icon}</div> */}
            <div className="flex-grow text-center overflow-hidden">
                <h4 className="text-white text-sm truncate">{title}</h4>
                <p className="text-white text-sm truncate">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
