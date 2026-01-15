import toast from "react-hot-toast";
import * as AdminApi from "../api/endpoints/adminAPI";
import { AxiosError } from "axios";
import type { ListUsersApiResponse } from "../shared/types/api/admin";

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
