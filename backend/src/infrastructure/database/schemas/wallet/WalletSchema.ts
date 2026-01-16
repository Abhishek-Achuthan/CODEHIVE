import { Document, Schema, Types } from 'mongoose';

export interface WalletDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletLeanDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const WalletSchema = new Schema<WalletDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  },
  { timestamps: true }
);
