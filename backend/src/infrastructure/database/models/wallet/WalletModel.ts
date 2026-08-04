import { model } from 'mongoose';
import { WalletDoc, WalletSchema } from '../../schemas/wallet/WalletSchema';

export const WalletModel = model<WalletDoc>('Wallet', WalletSchema);
