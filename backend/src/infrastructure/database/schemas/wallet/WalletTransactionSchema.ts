import { Document, Schema, Types } from 'mongoose';
import { WalletTransactionReason } from '../../../../domain/types/WalletTransactionReason';
import { WalletTransactionType } from '../../../../domain/types/WalletTransactionType';

export interface WalletTransactionDoc extends Document {
  _id: Types.ObjectId;
  walletId: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  reason: WalletTransactionReason;
  referenceId: string;
  createdAt: Date;
  affectsBalance: boolean;
}

export interface WalletTransactionLeanDoc {
  _id: Types.ObjectId;
  walletId: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  reason: WalletTransactionReason;
  referenceId: string;
  createdAt: Date;
  affectsBalance: boolean;
} 

export const WalletTransactionSchema = new Schema<WalletTransactionDoc>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(WalletTransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    reason: {
      type: String,
      enum: Object.values(WalletTransactionReason),
      required: true,
    },
    referenceId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    affectsBalance: { type: Boolean, default: true },
  },
  { timestamps: false }
);
