import { Document, Schema, Types } from 'mongoose';

export interface RoomReportDocument extends Document {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  reporterId: Types.ObjectId;
  reportedUserId: Types.ObjectId;
  reason: string;
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  resolvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type RoomReportLeanDoc = {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  reporterId: Types.ObjectId;
  reportedUserId: Types.ObjectId;
  reason: string;
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  resolvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const RoomReportSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: 'Room', required: true, index: true },
    reporterId: { type: Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['PENDING', 'REVIEWED', 'RESOLVED'], default: 'PENDING' },
    resolvedBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);
