import { inject, injectable } from 'tsyringe';
import type { ISendSessionReminderUseCase } from '../interface/session/ISendSessionReminderUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { INotificationService } from '../../ports/notifications/INotificationService';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class SendSessionReminderUseCase implements ISendSessionReminderUseCase {
  constructor(
    @inject('ISessionRepository')
    private readonly _sessionRepo: ISessionRepository,
    @inject('INotificationService')
    private readonly _notificationService: INotificationService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
  ) {}

  async execute(sessionId: string): Promise<void> {
    const session = await this._sessionRepo.find(sessionId);

    if (!session) {
      this._logger.warn(`[SendSessionReminderUseCase] ${ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND}: ${sessionId}`);
      return;
    }

    if (session.status !== SessionStatus.UPCOMING) {
      this._logger.info(
        `[SendSessionReminderUseCase] Session ${sessionId} is not in UPCOMING status (current status: ${session.status}). Skipping reminder notification.`,
      );
      return;
    }

    const timeString = new Date(session.startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const menteeMessage = `Your mentoring session on "${session.topic}" is starting in 30 minutes (at ${timeString}).`;
    const mentorMessage = `Your upcoming mentoring session on "${session.topic}" is starting in 30 minutes (at ${timeString}).`;

    this._logger.info(
      `[SendSessionReminderUseCase] Sending 30-minute reminder notifications for session: ${sessionId}`,
    );

    const actionUrl = session.joinUrl ?? '/dashboard/sessions';
    const metadata = {
      sessionId: session.id,
      notificationType: 'SESSION_REMINDER_30_MIN',
    };

    // Notify Mentee (User)
    await this._notificationService.notify({
      recipientId: session.userId,
      type: 'INFO',
      category: 'SESSION',
      title: 'Session Starting in 30 Minutes',
      message: menteeMessage,
      actionUrl,
      metadata,
      sendEmail: true,
    });

    // Notify Mentor
    await this._notificationService.notify({
      recipientId: session.mentorId,
      type: 'INFO',
      category: 'SESSION',
      title: 'Session Starting in 30 Minutes',
      message: mentorMessage,
      actionUrl,
      metadata,
      sendEmail: true,
    });
  }
}
