import { Document, Schema, Types } from 'mongoose';

export interface SavedListDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SavedListSchema = new Schema<SavedListDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

SavedListSchema.index({ userId: 1, name: 1 }, { unique: true });
