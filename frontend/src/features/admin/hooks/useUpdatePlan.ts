import { useCallback, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import type { UpdatePlanPayload } from "../../../shared/types/view/PlanView";

export function useUpdatePlan() {
  const [loading, setLoading] = useState(false);

  const updatePlan = useCallback(async (id: string, payload: UpdatePlanPayload) => {
    setLoading(true);
    try {
      const data = await AdminService.updatePlan(id, payload);
      toast.success("Plan updated successfully");
      return { success: true, data };
    } catch (error) {
      console.error("Error updating plan:", error);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePlan, loading };
}
