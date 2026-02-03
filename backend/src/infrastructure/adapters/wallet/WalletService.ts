import { inject, injectable } from 'tsyringe';
import { IWalletService } from '../../../application/ports/wallet/IWalletService';
import { type IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import { WalletTransactionEntity } from '../../../domain/entities/Wallet/WalletTransactionEntity';
import { WalletTransactionType } from '../../../domain/types/WalletTransactionType';
import { Credit, Debit } from '../../../domain/types/WalletTransactionInput';

@injectable()
export class WalletService implements IWalletService {
    constructor(
        @inject('IWalletRepository') private readonly _walletRepository : IWalletRepository
    ){}

    async credit(input: Credit): Promise<WalletTransactionEntity> {
        
        if(input.amount <=0 ) {
            throw new Error('Amount must be greater than zero')
        }
        
        const transaction : WalletTransactionEntity = {
            walletId : input.walletId,
            type : WalletTransactionType.CREDIT,
            amount: input.amount,
            reason: input.reason, 
            referenceId: input.referenceId,
            createdAt: new Date(),
        }

        return this._walletRepository.addTransaction(transaction);
    }

    async debit(input: Debit): Promise<WalletTransactionEntity> {
        if(input.amount <=0 ) {
            throw new Error('Amount must be greater than zero')
        }

        const balance = await this._walletRepository.getBalance(input.walletId);

        if(balance < input.amount) {
            throw new Error('Insufficient wallet balance');
        }

        const transaction : WalletTransactionEntity = {
            walletId: input.walletId,
            type : WalletTransactionType.DEBIT,
            amount : input.amount,
            reason: input.reason,
            referenceId:input.referenceId,
            createdAt : new Date(),
        }

        return this._walletRepository.addTransaction(transaction);
    }
}
