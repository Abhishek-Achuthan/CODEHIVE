export interface ISendSessionReminderUseCase {
  execute(sessionId: string): Promise<void>;
}
