import { WalletEntity } from '../entities/Wallet/WalletEntity';
import { WalletTransactionEntity } from '../entities/Wallet/WalletTransactionEntity';

export interface IWalletRepository {
    findByUserId(userId:string):Promise<WalletEntity | null>;
    createWallet(userId:string):Promise<WalletEntity>;
    addTransaction(transaction:WalletTransactionEntity):Promise<WalletTransactionEntity>;
    findTransactionsByWalletId(walletId:string):Promise<WalletTransactionEntity[]>
    getBalance(walletId:string): Promise<number>
}