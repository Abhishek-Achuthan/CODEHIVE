export interface IGetMentorReviewsUseCase {
  execute(mentorId: string): Promise<any[]>;
}
