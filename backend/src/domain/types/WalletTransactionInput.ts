import { WalletTransactionReason } from '../../domain/types/WalletTransactionReason';

export interface Credit {
    walletId:string;
    amount:number;
    reason : WalletTransactionReason;
    referenceId:string
}


export interface Debit {
    walletId:string;
    amount : number;
    reason : WalletTransactionReason;
    referenceId:string;
}