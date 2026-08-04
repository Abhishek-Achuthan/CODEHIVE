import type { WalletTransactionEntity } from '../../../../domain/entities/wallet/WalletTransactionEntity';

export interface GetWalletTransactionsDTO {
  transactions: WalletTransactionEntity[];
}

export interface IGetWalletTransactionsUseCase {
  execute(userId: string): Promise<GetWalletTransactionsDTO>;
}
