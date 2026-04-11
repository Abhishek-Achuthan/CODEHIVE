import { Document, Schema, Types } from 'mongoose';

export type RoomRole = 'HOST' | 'PARTICIPANT';

export interface ParticipantDocument extends Document {
  _id: Types.ObjectId;

  roomId: Types.ObjectId;
  userId: Types.ObjectId;

  role: RoomRole;

  createdAt: Date;
  updatedAt: Date;
}

export type ParticipantLeanDoc = {
  _id: Types.ObjectId;

  roomId: Types.ObjectId;
  userId: Types.ObjectId;

  role: RoomRole;

  createdAt: Date;
  updatedAt: Date;
};

export const ParticipantSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['HOST', 'PARTICIPANT'],
    default: 'PARTICIPANT',
  },
}, { timestamps: true });

ParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true });