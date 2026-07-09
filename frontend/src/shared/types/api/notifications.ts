export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
export type NotificationCategory = 'AUTH' | 'ROOM' | 'MENTOR' | 'SESSION' | 'PAYMENT' | 'REPORT' | 'QNA';

export interface NotificationEntity {
  id: string;
  recipientId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
