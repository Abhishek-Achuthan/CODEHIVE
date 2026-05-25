import { useCallback, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import type { CreatePlanPayload } from "../../../shared/types/view/PlanView";

export function useCreatePlan() {
  const [loading, setLoading] = useState(false);

  const createPlan = useCallback(async (payload: CreatePlanPayload) => {
    setLoading(true);
    try {
      const data = await AdminService.createPlan(payload);
      toast.success("Plan created successfully");
      return { success: true, data };
    } catch (error) {
      console.error("Error creating plan:", error);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPlan, loading };
}
