import { inject, injectable } from 'tsyringe';
import type { INotificationService, CreateNotificationDto } from '../ports/notifications/INotificationService';
import type { INotificationRepository } from '../../domain/interfaces/INotificationRepository';
import type { ISocketService } from '../ports/socket/ISocketService';
import type { IEmailService } from '../ports/mail/IEmailService';
import type { IUserRepository } from '../../domain/interfaces/IUserRepository';
import type { NotificationEntity } from '../../domain/entities/NotificationEntity';
import type { PaginationResult } from '../../domain/types/PaginationResult';
import type { ILoggerService } from '../ports/logging/ILoggerService';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject('INotificationRepository') private readonly _notificationRepository: INotificationRepository,
    @inject('ISocketService') private readonly _socketService: ISocketService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IUserRepository') private readonly _userRepository: IUserRepository,
    @inject('ILoggerService') private readonly _logger: ILoggerService
  ) {}

  async notify(dto: CreateNotificationDto): Promise<NotificationEntity> {
    const createData: Partial<NotificationEntity> = {
      recipientId: dto.recipientId,
      type: dto.type,
      category: dto.category,
      title: dto.title,
      message: dto.message,
    };
    if (dto.actionUrl !== undefined) createData.actionUrl = dto.actionUrl;
    if (dto.metadata !== undefined) createData.metadata = dto.metadata;

    const notification = await this._notificationRepository.create(createData);

    try {
      this._socketService.emitToUser(dto.recipientId, 'new_notification', notification);
    } catch (error) {
      this._logger.error('Failed to emit socket notification', { error: (error as Error).message });
    }

    if (dto.sendEmail) {
      this._sendEmailNotification(dto).catch(err => {
         this._logger.error('Failed to send email notification', { error: (err as Error).message });
      });
    }

    return notification;
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20): Promise<PaginationResult<NotificationEntity>> {
    return this._notificationRepository.findByUserId(userId, page, limit);
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    return this._notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return this._notificationRepository.markAllAsRead(userId);
  }

  private async _sendEmailNotification(dto: CreateNotificationDto): Promise<void> {
    const user = await this._userRepository.find(dto.recipientId);
    if (!user) return;

    const subject = dto.title;
    const actionUrl = dto.actionUrl ? `<p><a href="${process.env.FRONTEND_URL}${dto.actionUrl}">View Details</a></p>` : '';
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h3>${dto.title}</h3>
        <p>${dto.message}</p>
        ${actionUrl}
      </div>
    `;

    await this._emailService.sendMail(user.email, subject, html);
  }
}
