import { inject, injectable } from 'tsyringe';
import type { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import type { IGetMyWalletUseCase, MyWalletDTO } from '../interface/wallet/IGetMyWalletUseCase';

@injectable()
export class GetMyWalletUseCase implements IGetMyWalletUseCase {
  constructor(
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string): Promise<MyWalletDTO> {
    let wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet)  wallet = await this._walletRepository.createWallet(userId);

    const balance = await this._walletRepository.getBalance(wallet.id);

    return {
      walletId: wallet.id,
      balance,
    };
  }
}
