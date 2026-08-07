import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WalletService } from "../../../services/walletService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { WalletTransaction } from "../../../shared/types/api/wallet";

interface UseWalletTransactionsResult {
  transactions: WalletTransaction[];
  loading: boolean;
  refreshTransactions: () => Promise<void>;
  page: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const useWalletTransactions = (limit: number = 5): UseWalletTransactionsResult => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchTransactions = async (currentPage: number): Promise<void> => {
    try {
      setLoading(true);
      const data = await WalletService.getWalletTransactions(currentPage, limit);
      
      const newTransactions = Array.isArray(data.transactions) ? data.transactions : [];
      setTotal(data.total || 0);
      setTransactions(newTransactions);
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
    fetchTransactions(page);
  }, [page, limit]);

  const refreshTransactions = async () => {
    if (page === 1) {
      await fetchTransactions(1);
    } else {
      setPage(1);
    }
  };

  return {
    transactions,
    loading,
    refreshTransactions,
    page,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    setPage,
  };
};
