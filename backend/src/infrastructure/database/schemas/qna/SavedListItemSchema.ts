import { Document, Schema, Types } from 'mongoose';

export interface SavedListItemDoc extends Document {
  _id: Types.ObjectId;
  listId: Types.ObjectId;
  questionId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const SavedListItemSchema = new Schema<SavedListItemDoc>(
  {
    listId: { type: Schema.Types.ObjectId, ref: 'SavedList', required: true, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
  },
  { timestamps: true }
);

SavedListItemSchema.index({ listId: 1, questionId: 1 }, { unique: true });
