import { Document, Schema, Types } from 'mongoose';

export interface AiChatSessionDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type AiChatSessionLeanDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const AiChatSessionSchema = new Schema<AiChatSessionDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AiChatSessionSchema.index({ userId: 1, updatedAt: -1 });
