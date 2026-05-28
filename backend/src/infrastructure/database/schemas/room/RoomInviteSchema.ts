import { Document, Schema, Types } from 'mongoose';
import { RoomInviteType } from '../../../../domain/types/RoomInviteType';

export interface RoomInviteDocument extends Document {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  codeHash: string;
  createdBy: Types.ObjectId;
  type: RoomInviteType;
  sessionId?: Types.ObjectId;
  expiresAt?: Date;
  maxUses?: number;
  useCount: number;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RoomInviteLeanDoc = {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  codeHash: string;
  createdBy: Types.ObjectId;
  type: RoomInviteType;
  sessionId?: Types.ObjectId;
  expiresAt?: Date;
  maxUses?: number;
  useCount: number;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const RoomInviteSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: 'Room', required: true, index: true },
    codeHash: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(RoomInviteType), required: true },
    sessionId: { type: Types.ObjectId, ref: 'Session', sparse: true, index: true },
    expiresAt: { type: Date },
    maxUses: { type: Number },
    useCount: { type: Number, default: 0 },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);
