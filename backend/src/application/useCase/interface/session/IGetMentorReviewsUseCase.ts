export interface MentorReviewListItem {
  id: string;
  sessionId: string;
  roomId?: string;
  mentorId: string;
  studentId: string;
  student?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
  };
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetMentorReviewsResult {
  items: MentorReviewListItem[];
  totalItems: number;
  totalPages: number;
}

export interface IGetMentorReviewsUseCase {
  execute(mentorId: string, page?: number, limit?: number): Promise<GetMentorReviewsResult>;
}
