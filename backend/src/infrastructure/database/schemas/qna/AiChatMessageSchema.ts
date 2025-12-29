import { Document, Schema, Types } from 'mongoose';

export interface AiChatMessageDoc extends Document {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AiChatMessageLeanDoc = {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export const AiChatMessageSchema = new Schema<AiChatMessageDoc>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'AiChatSession',
      required: true,
    },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

AiChatMessageSchema.index({ sessionId: 1, createdAt: -1 });
