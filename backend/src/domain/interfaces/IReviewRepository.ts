import { ReviewEntity } from '../session/ReviewEntity';
import { GetMentorReviewsResult } from '../../application/useCase/interface/session/IGetMentorReviewsUseCase';
import { MentorReviewStats } from '../../application/useCase/interface/session/IGetMentorInsightsUseCase';

export interface IReviewRepository {
  create(review: ReviewEntity): Promise<ReviewEntity>;
  findBySessionAndStudent(sessionId: string, studentId: string): Promise<ReviewEntity | null>;
  findByMentorId(mentorId: string, page: number, limit: number): Promise<GetMentorReviewsResult>;
  findBySessionId(sessionId: string): Promise<ReviewEntity | null>;
  getMentorInsightStats(mentorId: string): Promise<MentorReviewStats>;
}
