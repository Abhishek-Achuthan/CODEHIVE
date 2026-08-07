import type { WalletTransactionEntity } from '../../../../domain/entities/wallet/WalletTransactionEntity';

export interface GetWalletTransactionsDTO {
  transactions: WalletTransactionEntity[];
  total: number;
}

export interface IGetWalletTransactionsUseCase {
  execute(userId: string, page: number, limit: number): Promise<GetWalletTransactionsDTO>;
}
