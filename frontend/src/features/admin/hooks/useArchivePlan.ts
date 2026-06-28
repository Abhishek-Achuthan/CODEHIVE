import { useCallback, useState } from "react";
import { PlanService } from "../../../services/planService";
import toast from "react-hot-toast";

export function useArchivePlan() {
  const [loading, setLoading] = useState(false);

  const archivePlan = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await PlanService.archivePlan(id);
      toast.success("Plan archived successfully");
      return { success: true, data };
    } catch (error) {
      console.error("Error archiving plan:", error);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return { archivePlan, loading };
}
