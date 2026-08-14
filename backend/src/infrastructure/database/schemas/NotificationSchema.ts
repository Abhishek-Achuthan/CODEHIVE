import { Document, Schema, Types } from 'mongoose';

export interface NotificationDocument extends Document {
  _id: Types.ObjectId;
  recipientId: Types.ObjectId;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  category: 'AUTH' | 'ROOM' | 'MENTOR' | 'SESSION' | 'PAYMENT' | 'REPORT' | 'QNA';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationLeanDoc = {
  _id: Types.ObjectId;
  recipientId: Types.ObjectId;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  category: 'AUTH' | 'ROOM' | 'MENTOR' | 'SESSION' | 'PAYMENT' | 'REPORT' | 'QNA';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export const NotificationSchema = new Schema<NotificationDocument>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'], required: true },
    category: { type: String, enum: ['AUTH', 'ROOM', 'MENTOR', 'SESSION', 'PAYMENT', 'REPORT', 'QNA'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    actionUrl: { type: String, required: false },
    metadata: { type: Schema.Types.Mixed, required: false },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

NotificationSchema.index(
  { recipientId: 1, 'metadata.sessionId': 1, 'metadata.notificationType': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'metadata.sessionId': { $exists: true },
      'metadata.notificationType': { $exists: true },
    },
  }
);

