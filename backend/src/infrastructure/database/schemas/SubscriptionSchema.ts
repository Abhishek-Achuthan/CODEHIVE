import { Schema, Types, Document } from "mongoose";
import { SubscriptionStatus } from "../../../domain/types/SubscriptionStatus";

export interface SubscriptionDocument extends Document {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  planId: Types.ObjectId;

  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt: Date;

  updatedAt: Date;
}

export type SubscriptionLeanDoc = {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  planId: Types.ObjectId;

  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt: Date;

  updatedAt: Date;
};

export const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
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
        $in: ["ACTIVE", "TRIALING"],
      },
    },
    unique: true,
  },
);