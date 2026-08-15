import { useCallback, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";

export function useUpdateMentorStatus() {
    const [loading, setLoading] = useState(false);

    const updateStatus = useCallback(async (id: string, status: 'approved' | 'rejected') => {
        setLoading(true);
        try {
            await AdminService.updateMentorStatus(id, status);
            toast.success(`Mentor application ${status} successfully`);
            return { success: true, status };
        } catch {
            toast.error("Failed to update mentor status");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateStatus, loading };
}
