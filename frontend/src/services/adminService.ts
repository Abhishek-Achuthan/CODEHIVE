import toast from "react-hot-toast";
import * as AdminApi from "../api/endpoints/adminApi";
import { AxiosError } from "axios";

export class AdminService {
  static async listUsers(
    role: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ) {
    try {
      const response = await AdminApi.getAllUsers(
        role,
        page,
        pageSize,
        sort,
        search
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
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
