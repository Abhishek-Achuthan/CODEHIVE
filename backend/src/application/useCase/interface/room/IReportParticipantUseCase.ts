export interface IReportParticipantUseCase {
  execute(
    roomId: string,
    reporterId: string,
    reportedUserId: string,
    reason: string,
    description?: string,
  ): Promise<void>;
}
