export interface ISessionReminderScheduler {
  scheduleReminder(sessionId: string, startTime: Date): Promise<void>;
}
