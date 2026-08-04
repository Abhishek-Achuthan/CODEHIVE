import { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import { ReviewEntity } from '../../../domain/session/ReviewEntity';
import { ReviewModel } from '../models/session/ReviewModel';
import mongoose from 'mongoose';

export class ReviewRepository implements IReviewRepository {
  async create(review: ReviewEntity): Promise<ReviewEntity> {
    const createdReview = await ReviewModel.create(review);
    return this.mapToEntity(createdReview);
  }

  async findBySessionAndStudent(sessionId: string, studentId: string): Promise<ReviewEntity | null> {
    const review = await ReviewModel.findOne({ sessionId, studentId });
    return review ? this.mapToEntity(review) : null;
  }

  async findByMentorId(mentorId: string): Promise<any[]> {
    const reviews = await ReviewModel.find({ mentorId })
      .populate('studentId', 'firstName lastName avatarUrl')
      .sort({ createdAt: -1 });
      
    return reviews.map(r => {
        const doc = r.toObject();
        return {
            id: doc._id.toString(),
            sessionId: doc.sessionId.toString(),
            mentorId: doc.mentorId.toString(),
            studentId: doc.studentId,
            rating: doc.rating,
            reviewText: doc.reviewText,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }
    });
  }

  async getMentorInsightStats(mentorId: string): Promise<any> {
    const stats = await ReviewModel.aggregate([
      { $match: { mentorId: new mongoose.Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          five: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          four: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          two: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          one: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ]);
    return stats.length > 0 ? stats[0] : {
        totalReviews: 0, averageRating: 0, five: 0, four: 0, three: 0, two: 0, one: 0
    };
  }

  private mapToEntity(doc: any): ReviewEntity {
    return {
      id: doc._id.toString(),
      sessionId: doc.sessionId.toString(),
      mentorId: doc.mentorId.toString(),
      studentId: doc.studentId.toString(),
      rating: doc.rating,
      reviewText: doc.reviewText,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
