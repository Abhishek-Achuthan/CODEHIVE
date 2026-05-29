import { Schema, Types, Document } from 'mongoose';
import { SubscriptionStatus } from '../../../domain/types/SubscriptionStatus';
import { PLAN_BILLING_INTERVALS } from '../../../domain/types/PlanBillingInterval';

export interface SubscriptionDocument extends Document {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  planId: Types.ObjectId;

  billingInterval?: string;

  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt: Date;

  canceledAt?: Date;

  expiredAt?: Date;

  stripePriceId?: string;

  updatedAt: Date;
}

export type SubscriptionLeanDoc = {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  planId: Types.ObjectId;

  billingInterval?: string;

  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt: Date;

  canceledAt?: Date;

  expiredAt?: Date;

  stripePriceId?: string;

  updatedAt: Date;
};

export const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },

    billingInterval: {
      type: String,
      enum: PLAN_BILLING_INTERVALS,
      required: false,
    },

    status: {
      type: String,
      enum:Object.values(SubscriptionStatus),
      required: true,
      index: true,
    },

    currentPeriodStart: {
      type: Date,
      required: true,
    },

    currentPeriodEnd: {
      type: Date,
      required: true,
      index: true,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    stripeCustomerId: {
      type: String,
      required: false,
      index: true,
    },

    stripeSubscriptionId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },

    canceledAt: {
      type: Date,
      required: false,
    },

    expiredAt: {
      type: Date,
      required: false,
    },

    stripePriceId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);


SubscriptionSchema.index(
  {
    userId: 1,
    status: 1,
  },
  {
    partialFilterExpression: {
      status: {
        $in: ['ACTIVE', 'TRIALING'],
      },
    },
    unique: true,
  },
);