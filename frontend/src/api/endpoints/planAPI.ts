import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreatePlanPayload, UpdatePlanPayload } from "../../shared/types/view/PlanView";

export const getPlans = (params?: { page?: number; limit?: number; search?: string }) =>
  apiClient.get(API_ROUTES.PLANS.LIST(params));

export const createPlan = (payload: CreatePlanPayload) =>
  apiClient.post(API_ROUTES.PLANS.CREATE, payload);

export const updatePlan = (id: string, payload: UpdatePlanPayload) =>
  apiClient.patch(API_ROUTES.PLANS.UPDATE(id), payload);

export const archivePlan = (id: string) =>
  apiClient.patch(API_ROUTES.PLANS.ARCHIVE(id));