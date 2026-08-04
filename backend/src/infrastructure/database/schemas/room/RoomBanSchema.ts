import { Document, Schema, Types } from 'mongoose';

export interface RoomBanDocument extends Document {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  bannedBy: Types.ObjectId;
  bannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RoomBanLeanDoc = {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  bannedBy: Types.ObjectId;
  bannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const RoomBanSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: 'Room', required: true, index: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    bannedBy: { type: Types.ObjectId, ref: 'User', required: true },
    bannedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

RoomBanSchema.index({ roomId: 1, userId: 1 }, { unique: true });
