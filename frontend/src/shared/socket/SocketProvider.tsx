import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './socketContext';
import { useAppSelector } from '../hooks/storeHooks';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket,setSocket] = useState<Socket | null>(null)    
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        if (!user || !accessToken) {
            setIsConnected(false);
            setConnectionError(null);
            setSocket((current) => {
                current?.disconnect();
                return null;
            })
            return;
        }

        setIsConnected(false);
        setConnectionError(null);

        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: {
                token: accessToken,
            },
        });

        const handleConnect = () => {
            setIsConnected(true);
            setConnectionError(null);
        }

        const handleDisconnect = () => {
            setIsConnected(false);
        }

        const handleConnectError =(error: Error) => {
            setIsConnected(false);
            setConnectionError(error.message);
        }

        newSocket.on('connect', handleConnect);
        newSocket.on('disconnect', handleDisconnect);
        newSocket.on('connect_error', handleConnectError);

        setSocket(newSocket);

        return () => {
            newSocket.off('connect', handleConnect);
            newSocket.off('disconnect', handleDisconnect);
            newSocket.off('connect_error', handleConnectError);
            newSocket.disconnect();
        };
    }, [user?.id,accessToken]);

    return (
        <SocketContext.Provider
            value={{ socket, isConnected, connectionError }}
        >
            {children}
        </SocketContext.Provider>
    );
};
