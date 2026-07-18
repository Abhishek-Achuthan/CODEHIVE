export interface ReviewEntity {
  id?: string;
  sessionId: string;
  mentorId: string;
  studentId: string;
  rating: number;
  reviewText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
