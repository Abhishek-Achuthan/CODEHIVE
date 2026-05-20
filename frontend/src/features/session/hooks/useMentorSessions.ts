import { useState, useEffect, useMemo } from "react";
import { SessionService } from "../../../services/sessionService";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import { useCancelSession } from "./useCancelSession";

export type StatusFilter = "upcoming" | "completed" | "cancelled";

export const useMentorSessions = () => {
    const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 6;

    const { cancelSession, loading: cancelLoading } = useCancelSession();

    const fetchMentorSessions = async () => {
        try {
            setLoading(true);

            const data = await SessionService.getBookedSessions({
                role: "mentor",
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery,
                filter: { status: activeTab }
            });
            setSessions(data.items || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            if (error instanceof BaseError) toast.error(error.message);
            else toast.error("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentorSessions();
    }, [currentPage, activeTab, searchQuery]);

    const paginatedSessions = sessions;

    const handleCancelSession = async (
        sessionId: string,
        successMessage?: string
    ) => {
        try {
            await cancelSession(sessionId, { successMessage });
            await fetchMentorSessions();
        } catch {
            // already handled
        }
    };

    const handleTabChange = (tab: StatusFilter) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    return {
        loading,
        sessions: paginatedSessions,
        totalPages,
        currentPage,
        cancelLoading,
        activeTab,
        searchQuery,

        setCurrentPage,
        handleTabChange,
        handleSearchChange,
        handleCancelSession,
    };
};
