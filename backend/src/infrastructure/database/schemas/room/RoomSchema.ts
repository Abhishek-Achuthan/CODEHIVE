import { Schema } from 'mongoose';
import { RoomVisibility } from '../../../../domain/types/RoomVisisblity';
import { RoomType } from '../../../../domain/types/RoomType';
import { Types } from 'mongoose';
import { Document } from 'mongoose';


export interface RoomDocument extends Document {
  _id: Types.ObjectId;

  title: string;
  description?: string;

  hostId: Types.ObjectId;

  type: RoomType;
  visibility: RoomVisibility;

  maxParticipants: number;
  participantCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export type RoomLeanDoc = {
  _id: Types.ObjectId;

  title: string;
  description?: string;

  hostId: Types.ObjectId;

  type: RoomType;
  visibility: RoomVisibility;

  maxParticipants: number;
  participantCount: number;

  createdAt: Date;
  updatedAt: Date;
};

export const RoomSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: {type: String,required:false},
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: { type: String, enum: ['CUSTOM', 'SESSION'], default: 'CUSTOM' },
    participantCount: { type: Number, required: true, default: 1 },
    visibility: {
      type: String,
      enum: ['PRIVATE', 'PUBLIC_REQUEST'],
      default: 'PRIVATE',
      index: true,
    },
    maxParticipants: { type: Number, required: true, default: 10 },
  },
  { timestamps: true },
);
