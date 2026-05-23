import { Schema, Types, Document } from 'mongoose';

import { FeatureKey } from '../../../domain/types/FeatureKey';
import { LimitKey } from '../../../domain/types/LimitKey';

export interface PlanDocument extends Document {
  _id: Types.ObjectId;

  name: string;

  slug: string;

  description?: string;

  isActive: boolean;

  isPublic: boolean;

  sortOrder: number;

  features: FeatureKey[];

  limits: Partial<Record<LimitKey, number>>;

  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };

  stripe?: {
    productId?: string;

    monthlyPriceId?: string;

    yearlyPriceId?: string;
  };

  createdAt: Date;

  updatedAt: Date;
}

export type PlanLeanDoc = {
  _id: Types.ObjectId;

  name: string;

  slug: string;

  description?: string;

  isActive: boolean;

  isPublic: boolean;

  sortOrder: number;

  features: FeatureKey[];

  limits: Partial<Record<LimitKey, number>>;

  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };

  stripe?: {
    productId?: string;

    monthlyPriceId?: string;

    yearlyPriceId?: string;
  };

  createdAt: Date;

  updatedAt: Date;
};

const PricingSchema = new Schema(
  {
    monthly: {
      type: Number,
      required: true,
      min: 0,
    },

    yearly: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  { _id: false },
);

const StripeMetadataSchema = new Schema(
  {
    productId: {
      type: String,
      required: false,
    },

    monthlyPriceId: {
      type: String,
      required: false,
    },

    yearlyPriceId: {
      type: String,
      required: false,
    },
  },
  { _id: false },
);

export const PlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    limits: {
      type: Map,
      of: Number,
      default: {},
    },

    pricing: {
      type: PricingSchema,
      required: true,
    },

    stripe: {
      type: StripeMetadataSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);