import { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';
import { MentorReviewStats } from '../../../application/useCase/interface/session/IGetMentorInsightsUseCase';
import { ReviewEntity } from '../../../domain/session/ReviewEntity';
import { GetMentorReviewsResult } from '../../../application/useCase/interface/session/IGetMentorReviewsUseCase';
import { ReviewModel } from '../models/session/ReviewModel';
import { ReviewDoc } from '../schemas/session/ReviewSchema';
import mongoose from 'mongoose';

interface ReviewStudentRef {
  _id?: mongoose.Types.ObjectId | string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role?: string;
}

interface ReviewSessionRef {
  _id?: mongoose.Types.ObjectId | string;
  roomId?: mongoose.Types.ObjectId | string;
}

interface ReviewDocumentWithRelations extends Omit<ReviewEntity, 'id' | 'sessionId' | 'studentId' | 'mentorId'> {
  _id: mongoose.Types.ObjectId | string;
  sessionId: mongoose.Types.ObjectId | string | ReviewSessionRef;
  mentorId: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string | ReviewStudentRef;
}

const isReviewStudentRef = (value: ReviewDocumentWithRelations['studentId']): value is ReviewStudentRef =>
  typeof value === 'object' && value !== null && 'firstName' in value;

const isReviewSessionRef = (value: ReviewDocumentWithRelations['sessionId']): value is ReviewSessionRef =>
  typeof value === 'object' && value !== null && ('_id' in value || 'roomId' in value);

const toIdString = (value: mongoose.Types.ObjectId | string): string => value.toString();

export class ReviewRepository implements IReviewRepository {
  async create(review: ReviewEntity): Promise<ReviewEntity> {
    const createdReview = await ReviewModel.create(review);
    return this.mapToEntity(createdReview);
  }

  async findBySessionAndStudent(sessionId: string, studentId: string): Promise<ReviewEntity | null> {
    const review = await ReviewModel.findOne({ sessionId, studentId });
    return review ? this.mapToEntity(review) : null;
  }

  async findBySessionId(sessionId: string): Promise<ReviewEntity | null> {
    const review = await ReviewModel.findOne({ sessionId });
    return review ? this.mapToEntity(review) : null;
  }

  async findByMentorId(mentorId: string, page: number, limit: number): Promise<GetMentorReviewsResult> {
    const skip = (page - 1) * limit;
    
    const [reviews, totalItems] = await Promise.all([
      ReviewModel.find({ mentorId })
        .populate('studentId', 'firstName lastName avatarUrl role')
        .populate('sessionId', 'roomId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReviewModel.countDocuments({ mentorId })
    ]);
      
    const items = reviews.map(r => {
        const doc = r.toObject() as ReviewDocumentWithRelations;
        const sessionId = isReviewSessionRef(doc.sessionId)
          ? (doc.sessionId._id ? toIdString(doc.sessionId._id) : '')
          : toIdString(doc.sessionId);
        const roomId = isReviewSessionRef(doc.sessionId) && doc.sessionId.roomId
          ? toIdString(doc.sessionId.roomId)
          : undefined;
        const studentId = isReviewStudentRef(doc.studentId)
          ? (doc.studentId._id ? toIdString(doc.studentId._id) : '')
          : toIdString(doc.studentId);

        return {
            id: toIdString(doc._id),
            sessionId,
            ...(roomId !== undefined ? { roomId } : {}),
            mentorId: toIdString(doc.mentorId),
            studentId,
            ...(isReviewStudentRef(doc.studentId) ? {
              student: {
                firstName: doc.studentId.firstName,
                lastName: doc.studentId.lastName,
                ...(doc.studentId.avatarUrl !== undefined ? { avatarUrl: doc.studentId.avatarUrl } : {}),
                ...(doc.studentId.role !== undefined ? { role: doc.studentId.role } : {}),
              },
            } : {}),
            rating: doc.rating,
            reviewText: doc.reviewText ?? '',
            createdAt: doc.createdAt ?? new Date(0),
            updatedAt: doc.updatedAt ?? new Date(0),
        };
    });

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  }

  async getMentorInsightStats(mentorId: string): Promise<MentorReviewStats> {
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

  private mapToEntity(doc: ReviewDoc): ReviewEntity {
    return {
      id: doc._id.toString(),
      sessionId: doc.sessionId.toString(),
      mentorId: doc.mentorId.toString(),
      studentId: doc.studentId.toString(),
      rating: doc.rating,
      ...(doc.reviewText !== undefined ? { reviewText: doc.reviewText } : {}),
      ...(doc.createdAt !== undefined ? { createdAt: doc.createdAt } : {}),
      ...(doc.updatedAt !== undefined ? { updatedAt: doc.updatedAt } : {}),
    };
  }
}
