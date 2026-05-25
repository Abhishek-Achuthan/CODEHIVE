import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { PlanView } from "../../../shared/types/view/PlanView";

export function useFetchPublicPlans() {
  const [plans, setPlans] = useState<PlanView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(API_ROUTES.PLANS.LIST({ limit: 20 }));
      const items: PlanView[] = Array.isArray(response.data?.items)
        ? response.data.items
        : [];
      // Only show public, active plans sorted by sortOrder
      const visible = items
        .filter((p) => p.isActive && p.isPublic)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setPlans(visible);
    } catch {
      setError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error };
}
