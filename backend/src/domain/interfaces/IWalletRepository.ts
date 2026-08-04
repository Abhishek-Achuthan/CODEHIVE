import { WalletEntity } from '../entities/wallet/WalletEntity';
import { WalletTransactionEntity } from '../entities/wallet/WalletTransactionEntity';

export interface IWalletRepository {
    findByUserId(userId:string):Promise<WalletEntity | null>;
    createWallet(userId:string):Promise<WalletEntity>;
    addTransaction(transaction:WalletTransactionEntity):Promise<WalletTransactionEntity>;
    findTransactionsByWalletId(walletId:string):Promise<WalletTransactionEntity[]>
    getBalance(walletId:string): Promise<number>
}
