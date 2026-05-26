import toast from "react-hot-toast";
import * as PlanApi from "../api/endpoints/planAPI";
import { AxiosError } from "axios";
import type { CreatePlanPayload, UpdatePlanPayload } from "../shared/types/view/PlanView";
import type { ListPlansApiResponse, PlanApiResponse } from "../shared/types/api/admin";

export class PlanService {
  static async listPlans(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<ListPlansApiResponse> {
    try {
      const response = await PlanApi.getPlans({ page, limit, search });
      return response.data as ListPlansApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async createPlan(payload: CreatePlanPayload): Promise<PlanApiResponse> {
    try {
      const response = await PlanApi.createPlan(payload);
      return response.data as PlanApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async updatePlan(id: string, payload: UpdatePlanPayload): Promise<PlanApiResponse> {
    try {
      const response = await PlanApi.updatePlan(id, payload);
      return response.data as PlanApiResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async archivePlan(id: string): Promise<PlanApiResponse> {
    try {
      const response = await PlanApi.archivePlan(id);
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
