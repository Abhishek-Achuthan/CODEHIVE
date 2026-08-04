export type WalletTransactionType = "CREDIT" | "DEBIT";

export type WalletTransactionReason = "SESSION_BOOKING" | "SESSION_REFUND";

export interface MyWalletResponse {
  walletId: string;
  balance: number;
}

export interface WalletTransaction {
  id?: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  reason: WalletTransactionReason;
  referenceId: string;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
}
