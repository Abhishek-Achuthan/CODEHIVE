import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreatePlanPayload, UpdatePlanPayload } from "../../shared/types/view/PlanView";

export const getAllUsers = (
  role: string,
  page?: number,
  pageSize?: number,
  sort?: string,
  search?: string
) => {
  const url = API_ROUTES.ADMIN.USER_LISTING({
    role,
    page,
    pageSize,
    sort,
    search,
  });

  return apiClient.get(url);
};

export const updateUserStatus = (id: string, status: boolean) => apiClient.patch(API_ROUTES.ADMIN.UPDATE_USER_STATUS, { id, status });

export const getMentorApplications = (
  page?: number,
  pageSize?: number,
  search?: string
) => {
  const url = API_ROUTES.ADMIN.MENTOR_APPLICATIONS({ page, pageSize, search });
  return apiClient.get(url);
};

export const updateMentorStatus = (id: string, status: 'approved' | 'rejected') =>
  apiClient.patch(API_ROUTES.ADMIN.UPDATE_MENTOR_STATUS, { id, status });

// ─── Plan API ────────────────────────────────────────────────────────────────

export const getPlans = (params?: { page?: number; limit?: number; search?: string }) =>
  apiClient.get(API_ROUTES.PLANS.LIST(params));

export const createPlan = (payload: CreatePlanPayload) =>
  apiClient.post(API_ROUTES.PLANS.CREATE, payload);

export const updatePlan = (id: string, payload: UpdatePlanPayload) =>
  apiClient.patch(API_ROUTES.PLANS.UPDATE(id), payload);

export const archivePlan = (id: string) =>
  apiClient.patch(API_ROUTES.PLANS.ARCHIVE(id));


