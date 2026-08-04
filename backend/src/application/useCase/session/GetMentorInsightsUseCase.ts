import { injectable, inject } from 'tsyringe';
import type { IGetMentorInsightsUseCase } from '../interface/session/IGetMentorInsightsUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';

@injectable()
export class GetMentorInsightsUseCase implements IGetMentorInsightsUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository,
    @inject('ISessionRepository') private sessionRepository: ISessionRepository
  ) {}

  async execute(mentorId: string): Promise<any> {
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
      five: totalReviews > 0 ? Math.round((reviewStats.five / totalReviews) * 100) : 0,
      four: totalReviews > 0 ? Math.round((reviewStats.four / totalReviews) * 100) : 0,
      three: totalReviews > 0 ? Math.round((reviewStats.three / totalReviews) * 100) : 0,
      two: totalReviews > 0 ? Math.round((reviewStats.two / totalReviews) * 100) : 0,
      one: totalReviews > 0 ? Math.round((reviewStats.one / totalReviews) * 100) : 0,
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
