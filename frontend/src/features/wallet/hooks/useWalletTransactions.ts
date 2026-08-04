import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WalletService } from "../../../services/walletService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { WalletTransaction } from "../../../shared/types/api/wallet";

interface UseWalletTransactionsResult {
  transactions: WalletTransaction[];
  loading: boolean;
  refreshTransactions: () => Promise<void>;
}

export const useWalletTransactions = (): UseWalletTransactionsResult => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await WalletService.getWalletTransactions();
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    refreshTransactions: fetchTransactions,
  };
};
