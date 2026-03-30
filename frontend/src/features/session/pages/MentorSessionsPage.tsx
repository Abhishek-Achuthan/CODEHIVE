import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useMentorSessions } from "../hooks/useMentorSessions";
import type { RootState } from "../../../store";
import { StatusTabs } from "../components/StatusTabs";
import { Calendar, Loader2, Search } from "lucide-react";
import { SessionCard } from "../components/SessionCard";
import toast from "react-hot-toast";
import { Pagination } from "../../../shared/ui/Pagination";
import { PageHeader } from "../../../shared/ui/PageHeader";

export default function MentorSessionsPage() {
    const user = useAppSelector((state: RootState) => state.auth.user);

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
    } = useMentorSessions({ userId: user?.id });

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Hosted Sessions"
                description="Sessions you're conducting as a mentor"
            />

            {/* Tabs & Search */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
                <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search */}
                <div className="relative group w-full sm:w-80">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-lg group-focus-within:bg-indigo-500/10 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search student or topic..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
            </div>

            {/* Sessions Content */}
            {loading ? (
                <div className="flex min-h-[400px] justify-center items-center bg-white/[0.01] rounded-3xl border border-white/5">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl relative">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
                        <Calendar className="h-10 w-10 text-zinc-500 relative z-10" />
                    </div>
                    <div className="mt-6 text-base font-bold text-white text-center">
                        No {activeTab} sessions
                        <p className="mt-2 text-sm text-zinc-500 font-medium italic">
                            {activeTab === "upcoming"
                                ? "Keep up the great work mentoring!"
                                : `You haven't conducted any ${activeTab} sessions yet.`}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                context="mentor"
                                onCancel={() => handleCancelSession(session.id)}
                                onJoinRoom={() => {
                                    toast.success("Starting session...");
                                }}
                                isCancelling={cancelLoading}
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
        </div>
    );
}
