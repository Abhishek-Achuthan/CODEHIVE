import { injectable, inject } from 'tsyringe';
import type {
  IGetMentorInsightsUseCase,
  MentorInsightsResult,
} from '../interface/session/IGetMentorInsightsUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';

@injectable()
export class GetMentorInsightsUseCase implements IGetMentorInsightsUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository,
    @inject('ISessionRepository') private sessionRepository: ISessionRepository
  ) {}

  async execute(mentorId: string): Promise<MentorInsightsResult> {
    const [reviewStats, sessionStats] = await Promise.all([
      this.reviewRepository.getMentorInsightStats(mentorId),
      this.sessionRepository.countSessionStats(mentorId),
    ]);

    const completed = sessionStats.completed;
    const cancelled = sessionStats.cancelled;
    const total = completed + cancelled;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalReviews = reviewStats.totalReviews;
    const ratingDistribution = {
      5: reviewStats.five || 0,
      4: reviewStats.four || 0,
      3: reviewStats.three || 0,
      2: reviewStats.two || 0,
      1: reviewStats.one || 0,
    };

    return {
      averageRating: Number(reviewStats.averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution,
      completedSessions: completed,
      cancelledSessions: cancelled,
      completionRate,
    };
  }
}
