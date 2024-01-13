import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    const initializeSocket = () => {
        if (!socketRef.current) {
            const newSocket = io('http://localhost:3000');
            socketRef.current = newSocket;
        }
        return socketRef.current;
    };

    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };

    return (
        <SocketContext.Provider value={{ initializeSocket, disconnectSocket, socketRef }}>
            {children}
        </SocketContext.Provider>
    );
};