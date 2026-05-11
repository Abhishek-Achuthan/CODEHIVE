import { Document, Schema, Types } from 'mongoose';
import { FeatureKey } from '../../../domain/types/FeatureKey';
import { LimitKey } from '../../../domain/types/LimitKey';

export interface PlanDocument extends Document {
  _id: Types.ObjectId;

  name: string;
  description?: string;

  price: number;
  currency: string;

  isActive: boolean;

  features: FeatureKey[];
  limits: Map<LimitKey, number>;

  createdAt: Date;
  updatedAt: Date;
}

export type PlanLeanDoc = {
  _id: Types.ObjectId;

  name: string;
  description?: string;

  price: number;
  currency: string;

  isActive: boolean;

  features: FeatureKey[];
  limits: Record<LimitKey, number>;

  createdAt: Date;
  updatedAt: Date;
};

export const PlanSchema = new Schema<PlanDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    isActive: { type: Boolean, required: true, default: true },
    features: {
      type: [String],
      enum: Object.values(FeatureKey),
      default: [],
    },
    limits: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

PlanSchema.index({ isActive: 1 });
