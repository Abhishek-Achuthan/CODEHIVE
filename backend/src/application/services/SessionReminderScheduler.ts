import { inject, injectable } from 'tsyringe';
import type { ISessionReminderScheduler } from '../ports/session/ISessionReminderScheduler';
import type { ISessionReminderPublisher } from '../ports/queue/ISessionReminderPublisher';
import type { ILoggerService } from '../ports/logging/ILoggerService';

const REMINDER_LEAD_TIME_MS = 30 * 60 * 1000; 

@injectable()
export class SessionReminderScheduler implements ISessionReminderScheduler {
  constructor(
    @inject('ISessionReminderPublisher')
    private readonly _reminderPublisher: ISessionReminderPublisher,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
  ) {}

  async scheduleReminder(sessionId: string, startTime: Date): Promise<void> {
    const reminderTimeMs = startTime.getTime() - REMINDER_LEAD_TIME_MS;
    const delayMs = reminderTimeMs - Date.now();

    if (delayMs <= 0) {
      this._logger.info(
        `[Session Reminder Scheduler] Session ${sessionId} starts within 30 minutes (or in past). Skipping 30-minute reminder scheduling. (startTime: ${startTime.toISOString()})`,
      );
      return;
    }

    this._logger.info(
      `[Session Reminder Scheduler] Scheduling 30-minute reminder for session: ${sessionId} in ${delayMs}ms (${(delayMs / 1000 / 60).toFixed(2)} minutes)`,
    );

    await this._reminderPublisher.publish(sessionId, delayMs);
  }
}
