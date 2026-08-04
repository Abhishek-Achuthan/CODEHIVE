import { Schema, Document } from 'mongoose';
import { ReviewEntity } from '../../../../domain/session/ReviewEntity';

export interface ReviewDoc extends Document, Omit<ReviewEntity, 'id'> {
  _id: string;
}

export const ReviewSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
