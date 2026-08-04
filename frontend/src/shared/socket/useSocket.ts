import { useContext } from 'react';
import { SocketContext } from './socketContext';

export const useSocket = () => useContext(SocketContext);
