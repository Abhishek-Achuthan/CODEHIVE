import * as WalletAPI from "../api/endpoints/walletAPI";
import { AxiosError } from "axios";
import { BaseError } from "../shared/errors/BaseError";
import type { MyWalletResponse } from "../shared/types/api/wallet";

export class WalletService {
  static async getMyWallet(): Promise<MyWalletResponse> {
    try {
      const response = await WalletAPI.getMyWallet();
      return response.data as MyWalletResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const msg = error.response?.data.message || 'Something went wrong';
      const status = error.response?.status;
      throw new BaseError(msg, status);
    }
    if (error instanceof Error) {
      throw new BaseError(error.message);
    }
    throw new BaseError('Unexpected error');
  }
}
