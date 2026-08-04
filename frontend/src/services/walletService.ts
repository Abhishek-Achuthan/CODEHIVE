import * as WalletAPI from "../api/endpoints/walletAPI";
import { AxiosError } from "axios";
import { BaseError } from "../shared/errors/BaseError";
import type {
  MyWalletResponse,
  WalletTransactionsResponse,
} from "../shared/types/api/wallet";
import { APP_MESSAGES } from "../shared/constants/messages";

export class WalletService {
  static async getMyWallet(): Promise<MyWalletResponse> {
    try {
      const response = await WalletAPI.getMyWallet();
      return response.data as MyWalletResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getWalletTransactions(): Promise<WalletTransactionsResponse> {
    try {
      const response = await WalletAPI.getWalletTransactions();
      return response.data as WalletTransactionsResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const msg = error.response?.data.message || APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
      const status = error.response?.status;
      throw new BaseError(msg, status);
    }
    if (error instanceof Error) {
      throw new BaseError(error.message);
    }
    throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
  }
}
