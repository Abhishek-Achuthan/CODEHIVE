import { Document, Schema, Types } from 'mongoose';

export interface QuestionViewDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  questionId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const QuestionViewSchema = new Schema<QuestionViewDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

QuestionViewSchema.index({ userId: 1, questionId: 1 }, { unique: true });
