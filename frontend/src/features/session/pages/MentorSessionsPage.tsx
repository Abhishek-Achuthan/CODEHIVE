import { useMentorSessions } from "../hooks/useMentorSessions";
import { StatusTabs } from "../components/StatusTabs";
import { Loader2, Search } from "lucide-react";
import { SessionCard } from "../components/SessionCard";
import { CancelSessionDialog } from "../components/CancelSessionDialog";
import toast from "react-hot-toast";
import { useState } from "react";
import { Pagination } from "../../../shared/ui/Pagination";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { Input } from "../../../shared/ui";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { DatePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';

function getTimeDiffMs(startTime: string): number {
    return new Date(startTime).getTime() - Date.now();
}

export default function MentorSessionsPage() {
    const currentUserRole = useAppSelector((state) => state.auth.user?.role ?? state.auth.role);
    const isMentor = currentUserRole === "mentor";
    const [selectedSession, setSelectedSession] = useState<BookedSessionResponse | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const {
        loading,
        sessions,
        totalPages,
        currentPage,
        cancelLoading,
        activeTab,
        searchQuery,
        dateFilter,
        setCurrentPage,
        handleTabChange,
        handleSearchChange,
        handleDateChange,
        handleCancelSession,
    } = useMentorSessions();

    const openCancelModal = (session: BookedSessionResponse) => {
        if (!isMentor || cancelLoading || isCancelModalOpen) return;

        if (getTimeDiffMs(session.startTime) <= 0) {
            toast.error("This session has already started and cannot be cancelled");
            return;
        }

        setSelectedSession(session);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        if (cancelLoading) return;
        setSelectedSession(null);
        setIsCancelModalOpen(false);
    };

    const confirmCancel = async () => {
        if (!selectedSession || cancelLoading || !isMentor) return;

        try {
            await handleCancelSession(
                selectedSession.id,
                "Session cancelled. Amount has been refunded to the user."
            );
            closeCancelModal();
        } catch {
            // Error already handled in hook
        }
    };

    return (
        <div className="flex flex-col">
            {/* Tabs & Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative z-50">
                        <CustomProvider theme="dark">
                            <DatePicker
                                format="yyyy-MM-dd"
                                value={dateFilter ? new Date(dateFilter) : null}
                                shouldDisableDate={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (activeTab === 'upcoming') {
                                        return date < today;
                                    }
                                    if (activeTab === 'completed') {
                                        return date > today;
                                    }
                                    return false;
                                }}
                                onChange={(v) => {
                                    if (v) {
                                        if (Number.isNaN(v.getTime())) {
                                            return;
                                        }
                                        const yyyy = v.getFullYear();
                                        const mm = String(v.getMonth() + 1).padStart(2, '0');
                                        const dd = String(v.getDate()).padStart(2, '0');
                                        handleDateChange(`${yyyy}-${mm}-${dd}`);
                                    } else {
                                        handleDateChange("");
                                    }
                                }}
                                onClean={() => handleDateChange("")}
                                placeholder="Filter by date..."
                                appearance="subtle"
                                style={{
                                    width: '100%',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    color: 'white'
                                }}
                                className="w-full sm:w-[200px]"
                            />
                        </CustomProvider>
                    </div>

                    <div className="w-full sm:w-64">
                        <Input
                            className="border border-white/10 bg-zinc-900/50 rounded-xl shadow-sm hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-200"
                            placeholder="Search student or topic..."
                            leftIcon={<Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Sessions Content */}
            {loading ? (
                <div className="flex min-h-[400px] justify-center items-center bg-white/[0.01] rounded-3xl border border-white/5">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
            ) : sessions.length === 0 ? (
                <EmptyState
                    animationSrc="https://lottie.host/c878f65a-2ee7-401f-b813-9899fccd135a/7q1YxDrkmN.json"
                    title={(searchQuery || dateFilter) ? "No sessions found" : "No hosted sessions yet"}
                    description={
                        (searchQuery || dateFilter)
                            ? "No sessions match your search or date filter. Try adjusting your criteria."
                            : "You haven't hosted any sessions in this category yet. Once a user books a session with you, it will appear here."
                    }
                    actionLabel={(searchQuery || dateFilter) ? "Clear Filters" : undefined}
                    onAction={(searchQuery || dateFilter) ? () => {
                        handleSearchChange("");
                        handleDateChange("");
                    } : undefined}
                />
            ) : (
                <>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                context="mentor"
                                onCancel={() => openCancelModal(session)}
                                showCancelAction={isMentor}
                                onJoinRoom={() => {
                                    toast.success("Starting session...");
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
                description="Are you sure you want to cancel this session? The session amount will be refunded to the user."
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                loading={cancelLoading}
                onConfirm={confirmCancel}
                onClose={closeCancelModal}
            />
        </div>
    );
}
