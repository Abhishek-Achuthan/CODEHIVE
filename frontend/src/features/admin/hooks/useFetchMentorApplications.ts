import { useCallback, useEffect, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import type { MentorApplicationView } from "../../../shared/types/view/MentorApplicationView";
import { mapMentorApplicationToView } from "../../../shared/mappers/user.mapper";

export function useFetchMentorApplications(search: string, page: number) {
    const [applications, setApplications] = useState<MentorApplicationView[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const fetchApplications = useCallback(async () => {
        setLoading(true);

        try {
            const data = await AdminService.listMentorApplications(page, 10, search);
            const items = Array.isArray(data?.items)
                ? data.items.map(mapMentorApplicationToView)
                : [];
            setApplications(items);
            setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
        } catch {
            toast.error("Failed to load mentor applications");
            setApplications([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return { applications, loading, totalPages, setApplications };
}
