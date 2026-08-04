export interface IActivateUpcomingSessionUseCase {
  execute(sessionId: string): Promise<void>
}
