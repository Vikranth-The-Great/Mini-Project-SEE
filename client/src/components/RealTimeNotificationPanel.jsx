import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';

export default function RealTimeNotificationPanel() {
  const { userToken, ngoToken, deliveryToken } = useAuth();
  const [items, setItems] = useState([]);

  const activeToken = useMemo(() => userToken || ngoToken || deliveryToken || null, [userToken, ngoToken, deliveryToken]);

  useEffect(() => {
    if (!activeToken) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token: activeToken },
    });

    socket.on('notification', (payload) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item = {
        id,
        title: payload?.title || 'New update',
        message: payload?.message || 'You have a new notification.',
        type: payload?.type || 'info',
      };

      setItems((prev) => [item, ...prev].slice(0, 5));

      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, 5500);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeToken]);

  if (!items.length) return null;

  return (
    <div className="rt-toast-wrap">
      {items.map((item) => (
        <div className="rt-toast" key={item.id}>
          <div className="rt-toast-title">{item.title}</div>
          <div className="rt-toast-msg">{item.message}</div>
        </div>
      ))}
    </div>
  );
}