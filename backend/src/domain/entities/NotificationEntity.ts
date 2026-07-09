export interface NotificationEntity {
  id: string;
  recipientId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  category: 'AUTH' | 'ROOM' | 'MENTOR' | 'SESSION' | 'PAYMENT' | 'REPORT' | 'QNA';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
