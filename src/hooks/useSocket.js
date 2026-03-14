import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

export function useSocket() {
  const { user, token: userToken } = useAuth();
  const { admin, token: adminToken } = useAdmin();
  const socketRef = useRef(null);

  useEffect(() => {
    const token = userToken || adminToken;
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userToken, adminToken]);

  return socketRef.current;
}