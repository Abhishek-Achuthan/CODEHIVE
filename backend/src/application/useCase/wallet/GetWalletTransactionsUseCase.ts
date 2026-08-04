import { inject, injectable } from 'tsyringe';
import type { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import type {
  GetWalletTransactionsDTO,
  IGetWalletTransactionsUseCase,
} from '../interface/wallet/IGetWalletTransactionsUseCase';

@injectable()
export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
  constructor(
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string): Promise<GetWalletTransactionsDTO> {
    let wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = await this._walletRepository.createWallet(userId);
    }

    const transactions = await this._walletRepository.findTransactionsByWalletId(
      wallet.id
    );

    return {
      transactions: transactions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
    };
  }
}
