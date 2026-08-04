import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    connectionError: string | null;
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    connectionError: null,
});
