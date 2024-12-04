import React, { createContext, useState, useEffect } from 'react';
import { setupSignalRConnection, disconnectSignalRConnection } from './apis/SignalIR';

export const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const [connectionId, setConnectionId] = useState(null);
    const [connection, setConnection] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            const newConnection = setupSignalRConnection(token);

            newConnection.start()
                .then(() => {
                    console.log("Connection established. Connection ID:", newConnection.connectionId);
                    setConnectionId(newConnection.connectionId);
                    setConnection(newConnection); // Set the connection
                })
                .catch(err => console.error("SignalR Connection Error: ", err));

            newConnection.onreconnected(newConnectionId => {
                console.log("SignalR Reconnected. New Connection ID:", newConnectionId);
                setConnectionId(newConnectionId); // Update connection ID on reconnection
            });

            return () => {
                disconnectSignalRConnection(newConnection);
            };
        }
    }, [token]);

    return (
        <SignalRContext.Provider value={{ connectionId, connection }}>
            {children}
        </SignalRContext.Provider>
    );
};
