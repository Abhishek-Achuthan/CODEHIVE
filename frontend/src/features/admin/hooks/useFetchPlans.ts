import { useCallback, useEffect, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import type { PlanView } from "../../../shared/types/view/PlanView";
import { PlanService } from "../../../services/planService";

function mapApiPlanToView(plan: {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  features: PlanView["features"];
  limits: PlanView["limits"];
  pricing: { monthly: number; yearly: number; currency: string };
  createdAt: string;
  updatedAt: string;
}): PlanView {
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    isActive: plan.isActive,
    isPublic: plan.isPublic,
    sortOrder: plan.sortOrder,
    features: plan.features,
    limits: plan.limits,
    pricing: plan.pricing,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

export function useFetchPlans(search: string, page: number) {
  const [plans, setPlans] = useState<PlanView[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PlanService.listPlans(page, 10, search);
      const items = Array.isArray(data?.items)
        ? data.items.map(mapApiPlanToView)
        : [];
      setPlans(items);
      setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, totalPages, setPlans, refetch: fetchPlans };
}
