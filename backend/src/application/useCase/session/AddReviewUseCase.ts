import { injectable, inject } from 'tsyringe';
import type { IAddReviewUseCase } from '../interface/session/IAddReviewUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { ReviewEntity } from '../../../domain/session/ReviewEntity';
import { SessionStatus } from '../../../domain/types/SessionStatus';

@injectable()
export class AddReviewUseCase implements IAddReviewUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository,
    @inject('ISessionRepository') private sessionRepository: ISessionRepository
  ) {}

  async execute(data: { sessionId: string; mentorId: string; studentId: string; rating: number; reviewText?: string }): Promise<ReviewEntity> {
    const session = await this.sessionRepository.find(data.sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== SessionStatus.COMPLETED) {
      throw new Error('Can only review completed sessions');
    }
    
    if (session.userId !== data.studentId) {
      throw new Error('Only the student who attended the session can review it');
    }

    const existingReview = await this.reviewRepository.findBySessionAndStudent(data.sessionId, data.studentId);
    if (existingReview) {
      throw new Error('You have already reviewed this session');
    }

    const reviewData: ReviewEntity = {
      sessionId: data.sessionId,
      mentorId: session.mentorId,
      studentId: data.studentId,
      rating: data.rating,
    };
    if (data.reviewText !== undefined) {
      reviewData.reviewText = data.reviewText;
    }

    return this.reviewRepository.create(reviewData);
  }
}
