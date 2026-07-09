import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { NotificationEntity } from '../../shared/types/api/notifications';
import { NotificationService } from '../../services/notificationService';

interface NotificationState {
  items: NotificationEntity[];
  total: number;
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  total: 0,
  unreadCount: 0,
  status: 'idle',
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page, limit }: { page?: number; limit?: number }) => {
    return await NotificationService.getNotifications(page, limit);
  }
);

export const markAsReadThunk = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    await NotificationService.markAsRead(id);
    return id;
  }
);

export const markAllAsReadThunk = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await NotificationService.markAllAsRead();
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationEntity>) => {
      state.items.unshift(action.payload);
      state.total += 1;
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updateNotificationUnreadCount: (state) => {
       state.unreadCount = state.items.filter(item => !item.isRead).length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.totalItems;
        state.unreadCount = action.payload.items.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, updateNotificationUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
