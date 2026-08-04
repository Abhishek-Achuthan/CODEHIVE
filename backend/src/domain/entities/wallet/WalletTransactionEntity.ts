import { WalletTransactionReason } from '../../types/WalletTransactionReason';
import { WalletTransactionType } from '../../types/WalletTransactionType';

export interface WalletTransactionEntity {
    id?:string;
    walletId:string;
    type : WalletTransactionType;
    amount:number;
    reason:WalletTransactionReason;
    referenceId:string;
    createdAt:Date;
    affectsBalance?: boolean;
}
