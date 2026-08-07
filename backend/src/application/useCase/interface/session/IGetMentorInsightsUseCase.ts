export interface MentorReviewStats {
  totalReviews: number;
  averageRating: number;
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface MentorInsightsResult {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  completedSessions: number;
  cancelledSessions: number;
  completionRate: number;
}

export interface IGetMentorInsightsUseCase {
  execute(mentorId: string): Promise<MentorInsightsResult>;
}
