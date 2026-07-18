import { ReviewEntity } from '../../../../domain/session/ReviewEntity';

export interface IAddReviewUseCase {
  execute(data: { sessionId: string; mentorId: string; studentId: string; rating: number; reviewText?: string }): Promise<ReviewEntity>;
}
