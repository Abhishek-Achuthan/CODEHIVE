import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useMentorSessions } from "../hooks/useMentorSessions";
import type { RootState } from "../../../store";
import { useEffect } from "react";
import MentorLayout from "../../../layouts/MentorLayout";
import { StatusTabs } from "../components/StatusTabs";
import { Calendar, Loader2, Search } from "lucide-react";
import { SessionCard } from "../components/SessionCard";
import toast from "react-hot-toast";
import { Pagination } from "../../../shared/ui/Pagination";

export default function MentorSessionsPage() {
    const navigate = useNavigate();
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

    useEffect(() => {
        if (user?.mentorStatus !== "approved") {
            navigate("/profile");
        }
    }, [user, navigate]);

    return (
        <MentorLayout>
            <div className="px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    {/* Page Title */}
                    <h1 className="text-center text-2xl font-semibold italic text-white">
                        My Hosted Sessions
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sessions you're conducting as a mentor
                    </p>

                    {/* Tabs & Search */}
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by student or topic..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-64 rounded-lg border border-gray-700 bg-black py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Sessions Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="mt-16 flex flex-col items-center justify-center py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                                <Calendar className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="mt-4 text-sm font-medium text-gray-400">
                                No {activeTab} sessions
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {activeTab === "upcoming"
                                    ? "You don't have any upcoming sessions to host"
                                    : `No ${activeTab} sessions to display`}
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

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </MentorLayout>
    );
}
