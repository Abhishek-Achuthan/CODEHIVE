export interface ISessionReminderPublisher {
  publish(sessionId: string, delayMs: number): Promise<void>;
}
