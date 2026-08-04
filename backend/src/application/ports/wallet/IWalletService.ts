import { WalletTransactionEntity } from '../../../domain/entities/wallet/WalletTransactionEntity';
import { Credit, Debit } from '../../../domain/types/WalletTransactionInput';

export interface IWalletService {
    credit(input:Credit):Promise<WalletTransactionEntity>;
    debit(input:Debit):Promise<WalletTransactionEntity>
}
