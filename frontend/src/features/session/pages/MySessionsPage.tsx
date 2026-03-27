import { useState, useMemo } from "react";
import { Search, Loader2, Calendar } from "lucide-react";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import toast from "react-hot-toast";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { SessionCard } from "../components/SessionCard";
import { StatusTabs, type StatusFilter } from "../components/StatusTabs";
import { Pagination } from "../../../shared/ui/Pagination";
import { useCancelSession } from "../hooks/useCancelSession";

export default function MySessionsPage() {
    const {loading,sessions,fetchSessions} = useFetchSessions()
    const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { cancelSession, loading: cancelLoading } = useCancelSession();

    const filteredSessions = useMemo(() => {
        return sessions.filter((s) => {
            const matchesStatus = s.status === activeTab;
            const matchesSearch =
                !searchQuery ||
                s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
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
            await fetchSessions();
        } catch {
            // Error already handled in hook
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    {/* Page Title */}
                    <h1 className="text-center text-2xl font-semibold italic text-white">
                        My Booked Sessions
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sessions you've booked as a user
                    </p>

                    {/* Tabs & Search */}
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-56 rounded-lg border border-gray-700 bg-black py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Sessions Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : paginatedSessions.length === 0 ? (
                        <div className="mt-16 flex flex-col items-center justify-center py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                                <Calendar className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="mt-4 text-sm font-medium text-gray-400">
                                No {activeTab} sessions
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {activeTab === "upcoming"
                                    ? "You don't have any upcoming sessions booked"
                                    : `No ${activeTab} sessions to display`}
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

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
