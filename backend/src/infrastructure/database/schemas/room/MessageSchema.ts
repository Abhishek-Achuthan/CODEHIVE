import { Document, Schema, Types } from 'mongoose';

export interface MessageDocument extends Document {
  _id: Types.ObjectId;

  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  parentMessageId?: Types.ObjectId;
  content: string;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type MessageLeanDoc = {
  _id: Types.ObjectId;

  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  parentMessageId?: Types.ObjectId;
  content: string;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export const MessageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: false,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

MessageSchema.index({ roomId: 1, createdAt: 1 });

