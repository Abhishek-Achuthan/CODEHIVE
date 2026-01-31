import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './socketContext';
import { useAppSelector } from '../hooks/storeHooks';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setIsConnected(false);
            return;
        }

        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: {
                userId: user.id,
            },
        });

        socketRef.current = socket;

        const onConnect = () => {
            setIsConnected(true);
            socket.emit('register', user.id);
        };

        const onDisconnect = () => {
            setIsConnected(false);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider
            value={{ socket: socketRef.current, isConnected }}
        >
            {children}
        </SocketContext.Provider>
    );
};
