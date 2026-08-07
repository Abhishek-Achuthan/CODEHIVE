import { injectable, inject } from 'tsyringe';
import type { IAddReviewUseCase } from '../interface/session/IAddReviewUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { ReviewEntity } from '../../../domain/session/ReviewEntity';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';

@injectable()
export class AddReviewUseCase implements IAddReviewUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository,
    @inject('ISessionRepository') private sessionRepository: ISessionRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository
  ) {}

  async execute(data: { sessionId: string; mentorId: string; studentId: string; rating: number; reviewText?: string }): Promise<ReviewEntity> {
    const session = await this.sessionRepository.find(data.sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== SessionStatus.COMPLETED) {
      let canReview = false;
      if (session.roomId) {
        const room = await this.roomRepository.find(session.roomId.toString());
        if (room && (room.lifecycleStatus === RoomLifeCycleStatus.READONLY || room.lifecycleStatus === RoomLifeCycleStatus.ARCHIVED)) {
          canReview = true;
        }
      }
      if (!canReview) {
        throw new Error('Can only review completed sessions or ended rooms');
      }
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
