import { ReviewEntity } from '../session/ReviewEntity';

export interface IReviewRepository {
  create(review: ReviewEntity): Promise<ReviewEntity>;
  findBySessionAndStudent(sessionId: string, studentId: string): Promise<ReviewEntity | null>;
  findByMentorId(mentorId: string): Promise<any[]>;
  getMentorInsightStats(mentorId: string): Promise<any>;
}
