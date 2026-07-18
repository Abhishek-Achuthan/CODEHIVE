export interface IGetMentorInsightsUseCase {
  execute(mentorId: string): Promise<any>;
}
