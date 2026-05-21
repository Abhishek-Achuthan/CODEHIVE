import { Schema, Types, Document } from 'mongoose';
import { RoomVisibility } from '../../../../domain/types/RoomVisibility';
import { RoomType } from '../../../../domain/types/RoomType';
import { FeatureKey } from '../../../../domain/types/FeatureKey';
import { LimitKey } from '../../../../domain/types/LimitKey';
import { RoomAdmissionPolicy } from '../../../../domain/types/RoomAdmissionPolicy';
import { RoomLifeCycleStatus } from '../../../../domain/types/RoomLifeCycleStatus';

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

  admissionPolicy: RoomAdmissionPolicy,

  lifecycleStatus: RoomLifeCycleStatus,

  sessionId? : Types.ObjectId,

  readonlyAt?: Date;

  archivedAt?: Date;

  purgedAt?: Date;

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

  lifecycleStatus: RoomLifeCycleStatus;

  admissionPolicy: RoomAdmissionPolicy;

  sessionId? : Types.ObjectId;

  readonlyAt?: Date;

  archivedAt?: Date;

  purgedAt?: Date;

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
    type: { type: String, enum: Object.values(RoomType), default: RoomType.CUSTOM },
    participantCount: { type: Number, required: true, default: 1 },
    visibility: {
      type: String,
      enum: Object.values(RoomVisibility),
      default: RoomVisibility.PUBLIC_REQUEST,
      index: true,
    },
    maxParticipants: { type: Number, required: true, default: 10 },
    featureSnapshot: { type: FeatureSnapshotSchema, default: null },
    admissionPolicy: { type: String, enum: Object.values(RoomAdmissionPolicy), default: RoomAdmissionPolicy.CLOSED },
    lifecycleStatus: {
      type: String,
      enum: Object.values(RoomLifeCycleStatus),
      default: RoomLifeCycleStatus.SCHEDULED
    },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: false},
    readonlyAt: { type: Date, required: false },
    archivedAt: { type: Date, required: false },
    purgedAt: { type: Date, required: false },
  },
  { timestamps: true },
);

RoomSchema.index(
  { sessionId: 1 },
  { unique: true, sparse: true },
)
