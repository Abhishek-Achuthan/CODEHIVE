import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/storeHooks';
import { fetchNotifications, markAsReadThunk, markAllAsReadThunk, addNotification } from '../../../store/slices/notificationSlice';
import { useSocket } from '../../../shared/socket/useSocket';
import type { NotificationEntity } from '../../../shared/types/api/notifications';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { socket, isConnected } = useSocket();
  
  const { items, unreadCount, status, total, error } = useAppSelector(state => state.notifications);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (user && status === 'idle') {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
  }, [user, status, dispatch]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: NotificationEntity) => {
      dispatch(addNotification(notification));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, isConnected, dispatch]);

  const loadMore = (page: number) => {
    dispatch(fetchNotifications({ page, limit: 20 }));
  };

  const markAsRead = (id: string) => {
    dispatch(markAsReadThunk(id));
  };

  const markAllAsRead = () => {
    dispatch(markAllAsReadThunk());
  };

  return {
    notifications: items,
    unreadCount,
    status,
    total,
    error,
    loadMore,
    markAsRead,
    markAllAsRead
  };
};
