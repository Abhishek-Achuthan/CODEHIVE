import { IGenericRepository } from './IGenericRepository';
import { NotificationEntity } from '../entities/NotificationEntity';
import { PaginationResult } from '../types/PaginationResult';

export interface INotificationRepository extends IGenericRepository<NotificationEntity> {
  findByUserId(userId: string, currentPage?: number, pageSize?: number): Promise<PaginationResult<NotificationEntity>>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
}
