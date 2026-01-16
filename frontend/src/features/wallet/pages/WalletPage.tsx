import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from "lucide-react";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { WalletService } from "../../../services/walletService";
import toast from "react-hot-toast";
import { BaseError } from "../../../shared/errors/BaseError";

export default function WalletPage() {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWallet = async (showRefreshToast = false) => {
        try {
            if (showRefreshToast) setRefreshing(true);
            else setLoading(true);

            const data = await WalletService.getMyWallet();
            setBalance(data.balance);

            if (showRefreshToast) toast.success("Balance refreshed");
        } catch (error) {
            if (error instanceof BaseError) toast.error(error.message);
            else toast.error("Failed to load wallet");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-4xl">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-white">My Wallet</h1>
                        <button
                            onClick={() => fetchWallet(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Balance Card */}
                    <div className="mt-8">
                        {loading ? (
                            <div className="rounded-2xl border border-gray-800 bg-linear-to-br from-gray-900 to-black p-8">
                                <div className="animate-pulse">
                                    <div className="h-4 w-24 rounded bg-gray-800" />
                                    <div className="mt-4 h-10 w-48 rounded bg-gray-800" />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-800 bg-linear-to-br from-indigo-950/40 via-gray-900 to-black p-8 relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
                                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

                                <div className="relative">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Wallet className="h-5 w-5" />
                                        <span className="text-sm font-medium">Available Balance</span>
                                    </div>

                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white tracking-tight">
                                            {formatCurrency(balance)}
                                        </span>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                                            <TrendingUp className="h-3 w-3" />
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-800 bg-black p-5 hover:bg-gray-950/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                    <ArrowDownLeft className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Earnings</div>
                                    <div className="text-xs text-gray-400">From mentoring sessions</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-800 bg-black p-5 hover:bg-gray-950/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <ArrowUpRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Payments</div>
                                    <div className="text-xs text-gray-400">For booked sessions</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-white">Transaction History</h2>

                        <div className="mt-4 rounded-xl border border-gray-800 bg-black">
                            {/* Empty state */}
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                                    <Wallet className="h-8 w-8 text-gray-600" />
                                </div>
                                <div className="mt-4 text-sm font-medium text-gray-400">No transactions yet</div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Your transaction history will appear here
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-800 bg-black p-5">
                            <div className="text-sm font-medium text-white">How it works</div>
                            <div className="mt-2 text-xs text-gray-400 leading-relaxed">
                                Your wallet is automatically credited when you receive payments for mentoring sessions.
                                You can use your wallet balance to book sessions with other mentors.
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-800 bg-black p-5">
                            <div className="text-sm font-medium text-white">Refunds</div>
                            <div className="mt-2 text-xs text-gray-400 leading-relaxed">
                                Session cancellations are automatically refunded to your wallet within 24 hours.
                                Contact support if you experience any issues.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
