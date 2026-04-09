import { useEffect, useState } from "react";
import { WalletService } from "../../../services/walletService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

interface UseWalletResult {
  balance: number;
  loading: boolean;
  refreshing: boolean;
  refreshWallet: () => Promise<void>;
}

export const useWallet = (): UseWalletResult => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchWallet = async (showRefreshToast: boolean): Promise<void> => {
    try {
      if (showRefreshToast) setRefreshing(true);
      else setLoading(true);

      const data = await WalletService.getMyWallet();
      setBalance(data.balance);

      if (showRefreshToast) {
        toast.success("Balance refreshed");
      }
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load wallet");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet(false);
  }, []);

  const refreshWallet = async (): Promise<void> => {
    await fetchWallet(true);
  };

  return {
    balance,
    loading,
    refreshing,
    refreshWallet,
  };
};
