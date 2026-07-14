import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "../../../shared/ui/EmptyState";

import { useWallet } from "../hooks/useWallet";
import { useWalletTransactions } from "../hooks/useWalletTransactions";
import type {
  WalletTransaction,
  WalletTransactionReason,
} from "../../../shared/types/api/wallet";

export default function WalletPage() {
  const { balance, loading, refreshing, refreshWallet } = useWallet();
  const {
    transactions,
    loading: transactionsLoading,
    refreshTransactions,
  } = useWalletTransactions();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatTransactionDate = (value: string): string => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const getTransactionLabel = (reason: WalletTransactionReason): string => {
    switch (reason) {
      case "SESSION_BOOKING":
        return "Session Payment";
      case "SESSION_REFUND":
        return "Refund";
      default:
        return reason;
    }
  };

  const handleRefresh = async (): Promise<void> => {
    await Promise.all([refreshWallet(), refreshTransactions()]);
  };

  const renderTransaction = (transaction: WalletTransaction) => {
    const isCredit = transaction.type === "CREDIT";

    return (
      <div
        key={transaction.id ?? `${transaction.referenceId}-${transaction.createdAt}`}
        className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-4 last:border-b-0 hover:bg-zinc-800/20 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100">
              {getTransactionLabel(transaction.reason)}
            </div>
            <div className="mt-0.5 text-xs text-zinc-500 font-medium">
              {formatTransactionDate(transaction.createdAt)}
            </div>
          </div>
        </div>

        <div
          className={`text-sm font-bold tracking-tight ${isCredit ? "text-emerald-400" : "text-zinc-100"}`}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-transparent text-white">

      <main className="px-4 py-8">
        <div className="mx-auto max-w-4xl grid gap-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-white">Wallet</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Balance */}
            <div className="md:col-span-2">
              {loading ? (
                <div className="h-full min-h-[160px] rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                  <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-zinc-800" />
                    <div className="mt-6 h-12 w-48 rounded bg-zinc-800" />
                  </div>
                </div>
              ) : (
                <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214] p-8 shadow-xl">
                  {/* Subtle background glow */}
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center gap-2.5 text-zinc-400">
                      <Wallet className="h-5 w-5" />
                      <span className="text-sm font-medium tracking-wide uppercase">Available Balance</span>
                    </div>

                    <div className="mt-6">
                      <span className="text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                        {formatCurrency(balance)}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4">
              <div className="rounded-xl border border-zinc-800 bg-[#121214] p-5 shadow-sm flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">Earnings</div>
                  <div className="text-[13px] text-zinc-500 mt-0.5 leading-relaxed">Incoming transfers from completed mentoring sessions.</div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#121214] p-5 shadow-sm flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <ArrowUpRight className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">Payments</div>
                  <div className="text-[13px] text-zinc-500 mt-0.5 leading-relaxed">Outgoing payments for sessions you have booked.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-4">
            <h2 className="text-lg font-bold tracking-tight text-zinc-100 mb-4">Transaction History</h2>

            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] shadow-sm min-h-[300px]">
              {transactionsLoading ? (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <p className="mt-4 text-sm font-medium text-zinc-500">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <EmptyState
                      title="No transactions yet"
                      description="Your wallet activity will appear here once you start booking or hosting mentoring sessions."
                  />
                </motion.div>
              ) : (
                <div className="flex flex-col">{transactions.map(renderTransaction)}</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="grid gap-6 sm:grid-cols-2 mt-4">
            <div className="rounded-xl border border-zinc-800/50 bg-[#09090b] p-6">
              <div className="text-[13px] font-bold uppercase tracking-wider text-zinc-400 mb-2">How it works</div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Your wallet is automatically credited when you receive payments for mentoring sessions. You can use this balance to pay for future sessions.
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/50 bg-[#09090b] p-6">
              <div className="text-[13px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Refunds & Policies</div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Session cancellations are automatically processed and refunded to your wallet balance within 24 hours.
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
