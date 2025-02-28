// src/context/MemberContext.js
import React, { createContext, useState } from 'react';

export const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
    const [registrationData, setRegistrationData] = useState(null);

    return (
        <MemberContext.Provider value={{ registrationData, setRegistrationData }}>
            {children}
        </MemberContext.Provider>
    );
};
