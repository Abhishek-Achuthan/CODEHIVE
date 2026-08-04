import { NotificationEntity } from '../../../domain/entities/NotificationEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';

export interface CreateNotificationDto {
  recipientId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  category: 'AUTH' | 'ROOM' | 'MENTOR' | 'SESSION' | 'PAYMENT' | 'REPORT' | 'QNA';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  sendEmail?: boolean;
}

export interface INotificationService {
  notify(dto: CreateNotificationDto): Promise<NotificationEntity>;
  getUserNotifications(userId: string, page?: number, limit?: number): Promise<PaginationResult<NotificationEntity>>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
}
