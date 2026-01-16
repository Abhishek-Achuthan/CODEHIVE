export interface MyWalletDTO {
  walletId: string;
  balance: number;
}

export interface IGetMyWalletUseCase {
  execute(userId: string): Promise<MyWalletDTO>;
}
