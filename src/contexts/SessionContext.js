// src/contexts/SessionContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const SessionContext = createContext();

export const useSession = () => {
    return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(() => {
        const savedSession = localStorage.getItem('sessionData');
        return savedSession ? JSON.parse(savedSession) : {};
    });

    useEffect(() => {
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }, [sessionData]);

    return (
        <SessionContext.Provider value={{ sessionData, setSessionData }}>
            {children}
        </SessionContext.Provider>
    );
};
