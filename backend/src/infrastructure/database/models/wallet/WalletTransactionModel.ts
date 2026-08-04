import { model } from 'mongoose';
import {
  WalletTransactionDoc,
  WalletTransactionSchema,
} from '../../schemas/wallet/WalletTransactionSchema';

export const WalletTransactionModel = model<WalletTransactionDoc>(
  'WalletTransaction',
  WalletTransactionSchema
);
