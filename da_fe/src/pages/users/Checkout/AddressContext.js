import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
    const [selectedAddress, setSelectedAddress] = useState(null);

    return (
        <AddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>{children}</AddressContext.Provider>
    );
};
