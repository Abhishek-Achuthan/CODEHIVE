import { Schema, Types, Document } from 'mongoose';
import { RoomVisibility } from '../../../../domain/types/RoomVisisblity';
import { RoomType } from '../../../../domain/types/RoomType';
import { FeatureKey } from '../../../../domain/types/FeatureKey';
import { LimitKey } from '../../../../domain/types/LimitKey';

export interface RoomDocument extends Document {
  _id: Types.ObjectId;

  title: string;
  description?: string;

  hostId: Types.ObjectId;

  type: RoomType;
  visibility: RoomVisibility;

  maxParticipants: number;
  participantCount: number;

  featureSnapshot: {
    planId: string;
    planName: string;
    enabledFeatures: FeatureKey[];
    limits: Partial<Record<LimitKey, number>>;
  } | null;

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

  featureSnapshot: {
    planId: string;
    planName: string;
    enabledFeatures: FeatureKey[];
    limits: Partial<Record<LimitKey, number>>;
  } | null;

  createdAt: Date;
  updatedAt: Date;
};

const FeatureSnapshotSchema = new Schema(
  {
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    enabledFeatures: { type: [String], default: [] },
    limits: { type: Map, of: Number, default: {} },
  },
  { _id: false },
);

export const RoomSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false },
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
    featureSnapshot: { type: FeatureSnapshotSchema, default: null },
  },
  { timestamps: true },
);

