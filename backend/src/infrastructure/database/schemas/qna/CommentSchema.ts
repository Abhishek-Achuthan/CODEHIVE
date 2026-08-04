import { Document, Schema, Types } from 'mongoose';

export interface CommentDoc extends Document {
  _id: Types.ObjectId;
  answerId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema<CommentDoc>(
  {
    answerId: {
      type: Schema.Types.ObjectId,
      ref: 'Answer',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);
