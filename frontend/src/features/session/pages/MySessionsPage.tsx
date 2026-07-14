import { useState, useEffect } from "react";
import { Search, Loader2, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { SessionCard } from "../components/SessionCard";
import { CancelSessionDialog } from "../components/CancelSessionDialog";
import { StatusTabs, type StatusFilter } from "../components/StatusTabs";
import { Pagination } from "../../../shared/ui/Pagination";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { useCancelSession } from "../hooks/useCancelSession";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../../shared/ui";
const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

function getTimeDiffMs(startTime: string): number {
    return new Date(startTime).getTime() - Date.now();
}

export default function MySessionsPage() {
    const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [paymentSource, setPaymentSource] = useState<"" | "STRIPE" | "WALLET">("");
    const [refundableOnly, setRefundableOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSession, setSelectedSession] = useState<BookedSessionResponse | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRefundEligible, setIsRefundEligible] = useState(false);
    const navigate = useNavigate();

    const itemsPerPage = 6;
    const { loading, sessions, totalPages, error, refetch } = useFetchSessions({
        role: "mentee",
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        filter: {
            status: activeTab,
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
            ...(paymentSource && { paymentSource }),
            ...(refundableOnly && { refundableNow: true }),
        },
    });

    useEffect(() => {
       if (error) toast.error(error);
    }, [error]);

    const { cancelSession, loading: cancelLoading } = useCancelSession();

    const handleTabChange = (tab: StatusFilter) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setDateFrom("");
        setDateTo("");
        setPaymentSource("");
        setRefundableOnly(false);
        setCurrentPage(1);
    };

    const activeFilterCount = [
        dateFrom,
        dateTo,
        paymentSource,
        refundableOnly ? "refundable" : "",
    ].filter(Boolean).length;

    const openCancelModal = (session: BookedSessionResponse) => {
        if (cancelLoading || isCancelModalOpen) return;

        const timeDiff = getTimeDiffMs(session.startTime);

        if (timeDiff <= 0) {
            toast.error("This session has already started and cannot be cancelled");
            return;
        }

        setSelectedSession(session);
        setIsRefundEligible(timeDiff >= REFUND_WINDOW_MS);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        if (cancelLoading) return;
        setIsCancelModalOpen(false);
        setSelectedSession(null);
        setIsRefundEligible(false);
    };

    const handleConfirmCancel = async () => {
        if (!selectedSession || cancelLoading) return;

        try {
            await cancelSession(selectedSession.id, {
                successMessage: isRefundEligible
                    ? "Session cancelled. Refund will be processed."
                    : "Session cancelled. No refund applicable.",
            });
            closeCancelModal();
            await refetch();
        } catch {
            // Error already handled in hook
        }
    };

    return (
        <div className="flex flex-col">
            <div className="relative z-40 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Search your sessions..."
                            leftIcon={<Search className="w-4 h-4" />}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <Button
                            variant={showFilters || activeFilterCount > 0 ? "primary" : "secondary"}
                            leftIcon={<Filter className="w-4 h-4" />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>

                        <AnimatePresence>
                            {showFilters && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                        onClick={() => setShowFilters(false)}
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
                                            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                                                <Filter className="h-5 w-5 text-indigo-400" />
                                                Advanced Filters
                                            </h3>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                                            <div className="flex flex-col gap-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2.5">
                                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                            From
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={dateFrom}
                                                            onChange={(e) => {
                                                                setDateFrom(e.target.value);
                                                                setCurrentPage(1);
                                                            }}
                                                            style={{ colorScheme: "dark" }}
                                                            className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        />
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                            To
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={dateTo}
                                                            onChange={(e) => {
                                                                setDateTo(e.target.value);
                                                                setCurrentPage(1);
                                                            }}
                                                            style={{ colorScheme: "dark" }}
                                                            className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                        Payment Source
                                                    </label>
                                                    <select
                                                        value={paymentSource}
                                                        onChange={(e) => {
                                                            const value = e.target.value as "" | "STRIPE" | "WALLET";
                                                            setPaymentSource(value);
                                                            setCurrentPage(1);
                                                        }}
                                                        className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    >
                                                        <option value="">All payment sources</option>
                                                        <option value="STRIPE">Stripe</option>
                                                        <option value="WALLET">Wallet</option>
                                                    </select>
                                                </div>

                                                <div className="pt-2">
                                                    <label className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-4 transition-colors hover:bg-zinc-800/50">
                                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Refundable now </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={refundableOnly}
                                                            onChange={(e) => {
                                                                setRefundableOnly(e.target.checked);
                                                                setCurrentPage(1);
                                                            }}
                                                            className="h-5 w-5 rounded border-white/10 bg-zinc-950 text-indigo-500 transition-colors focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-offset-transparent"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-6 py-5">
                                            <button
                                                onClick={handleResetFilters}
                                                disabled={activeFilterCount === 0}
                                                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                Clear All
                                            </button>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors hover:bg-indigo-600"
                                            >
                                                Show Results
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex min-h-[400px] justify-center items-center bg-white/[0.01] rounded-3xl border border-white/5">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
            ) : sessions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#121214] py-10 text-center"
                >
                    <EmptyState
                        title={`No ${activeTab} sessions`}
                        description={activeTab === "upcoming"
                            ? "Time to explore new mentorship opportunities!"
                            : `You don't have any ${activeTab} sessions listed.`}
                    />
                </motion.div>
            ) : (
                <>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onCancel={() => openCancelModal(session)}
                                onJoinRoom={() => {
                                    navigate(`/room/${session.roomId}`);
                                }}
                                isCancelling={cancelLoading}
                                cancelDisabled={getTimeDiffMs(session.startTime) <= 0}
                                cancelDisabledReason="This session has already started and cannot be cancelled"
                            />
                        ))}
                    </div>

                    <div className="mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}

            <CancelSessionDialog
                open={isCancelModalOpen}
                description={
                    isRefundEligible
                        ? "Are you sure you want to cancel this session?"
                        : "This session starts within the next 24 hours. If you cancel now, you will not receive a refund."
                }
                confirmLabel={isRefundEligible ? "Confirm" : "Confirm Cancel"}
                cancelLabel={isRefundEligible ? "Cancel" : "Go Back"}
                loading={cancelLoading}
                onConfirm={handleConfirmCancel}
                onClose={closeCancelModal}
            />
        </div>
    );
}
