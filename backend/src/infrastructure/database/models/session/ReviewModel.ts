import mongoose from 'mongoose';
import { ReviewDoc, ReviewSchema } from '../../schemas/session/ReviewSchema';

export const ReviewModel = mongoose.model<ReviewDoc>('Review', ReviewSchema);
