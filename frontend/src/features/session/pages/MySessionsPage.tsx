import { useState, useMemo, useEffect } from "react";
import { Search, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { SessionCard } from "../components/SessionCard";
import { StatusTabs, type StatusFilter } from "../components/StatusTabs";
import { Pagination } from "../../../shared/ui/Pagination";
import { useCancelSession } from "../hooks/useCancelSession";
import { PageHeader } from "../../../shared/ui/PageHeader";

export default function MySessionsPage() {
    const {loading,sessions,error,refetch} = useFetchSessions("user")
    const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
       if (error) toast.error(error);
    }, [error]);

    const { cancelSession, loading: cancelLoading } = useCancelSession();

    const filteredSessions = useMemo(() => {
        return sessions.filter((s) => {
            const matchesStatus = s.status === activeTab;
            const matchesSearch =
                !searchQuery ||
                s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.mentor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.mentor.lastName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [sessions, activeTab, searchQuery]);

    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleTabChange = (tab: StatusFilter) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleCancelSession = async (sessionId: string) => {
        try {
            await cancelSession(sessionId);
            await refetch();
        } catch {
            // Error already handled in hook
        }
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="My Sessions"
                description="Sessions you've booked as a user"
            />

            {/* Tabs & Search */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
                <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search */}
                <div className="relative group w-full sm:w-80">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-lg group-focus-within:bg-indigo-500/10 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your sessions..."
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
            ) : paginatedSessions.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl relative">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
                        <Calendar className="h-10 w-10 text-zinc-500 relative z-10" />
                    </div>
                    <div className="mt-6 text-base font-bold text-white text-center">
                        No {activeTab} sessions
                        <p className="mt-2 text-sm text-zinc-500 font-medium italic">
                            {activeTab === "upcoming"
                                ? "Time to explore new mentorship opportunities!"
                                : `You don't have any ${activeTab} sessions listed.`}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {paginatedSessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onCancel={() => handleCancelSession(session.id)}
                                onJoinRoom={() => {
                                    toast.success("Joining room...");
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
