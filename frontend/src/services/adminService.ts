import toast from "react-hot-toast";
import * as AdminApi from "../api/endpoints/adminApi";
import { AxiosError } from "axios";
import type { ListUsersApiResponse, ListMentorApplicationsApiResponse, ListPlansApiResponse, PlanApiResponse } from "../shared/types/api/admin";
import type { CreatePlanPayload, UpdatePlanPayload } from "../shared/types/view/PlanView";

export class AdminService {
  static async listUsers(
    role: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<ListUsersApiResponse> {
    try {
      const response = await AdminApi.getAllUsers(
        role,
        page,
        pageSize,
        sort,
        search
      );
      return response.data as ListUsersApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async updateUserStatus(id: string, status: boolean) {
    try {
      const response = await AdminApi.updateUserStatus(id, status);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async listMentorApplications(
    page?: number,
    pageSize?: number,
    search?: string
  ): Promise<ListMentorApplicationsApiResponse> {
    try {
      const response = await AdminApi.getMentorApplications(page, pageSize, search);
      return response.data as ListMentorApplicationsApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async updateMentorStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const response = await AdminApi.updateMentorStatus(id, status);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // ─── Plans ──────────────────────────────────────────────────────────────────

  static async listPlans(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<ListPlansApiResponse> {
    try {
      const response = await AdminApi.getPlans({ page, limit, search });
      return response.data as ListPlansApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async createPlan(payload: CreatePlanPayload): Promise<PlanApiResponse> {
    try {
      const response = await AdminApi.createPlan(payload);
      return response.data as PlanApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async updatePlan(id: string, payload: UpdatePlanPayload): Promise<PlanApiResponse> {
    try {
      const response = await AdminApi.updatePlan(id, payload);
      return response.data as PlanApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async archivePlan(id: string): Promise<PlanApiResponse> {
    try {
      const response = await AdminApi.archivePlan(id);
      return response.data as PlanApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private static handleError(error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unexpected error");
    }
    throw error;
  }
}
