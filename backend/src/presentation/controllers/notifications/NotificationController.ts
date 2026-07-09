import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { INotificationService } from '../../../application/ports/notifications/INotificationService';
import { HttpStatus } from '../../../shared/httpStatusCode';

@injectable()
export class NotificationController {
  constructor(
    @inject('INotificationService') private readonly _notificationService: INotificationService
  ) {}

  async getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
         res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
         return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this._notificationService.getUserNotifications(userId, page, limit);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId || !id) {
         res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized or missing ID' });
         return;
      }

      await this._notificationService.markAsRead(id, userId);

      res.status(HttpStatus.OK).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
         res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
         return;
      }

      await this._notificationService.markAllAsRead(userId);

      res.status(HttpStatus.OK).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
