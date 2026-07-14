import { useMentorSessions } from "../hooks/useMentorSessions";
import { StatusTabs } from "../components/StatusTabs";
import { Loader2, Search } from "lucide-react";
import { SessionCard } from "../components/SessionCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { motion } from "framer-motion";
import { CancelSessionDialog } from "../components/CancelSessionDialog";
import toast from "react-hot-toast";
import { useState } from "react";
import { Pagination } from "../../../shared/ui/Pagination";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { Input } from "../../../shared/ui";

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
        setCurrentPage,
        handleTabChange,
        handleSearchChange,
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

                {/* Search */}
                <div className="w-full sm:w-80">
                    <Input
                        placeholder="Search student or topic..."
                        leftIcon={<Search className="w-4 h-4" />}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Sessions Content */}
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
                            ? "Keep up the great work mentoring!"
                            : `You haven't conducted any ${activeTab} sessions yet.`}
                    />
                </motion.div>
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
