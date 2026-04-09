import { AxiosError } from "axios";

import * as UserApi from "../api/endpoints/userAPI";
import type { UserProfileApi, UpdateMyProfileRequest } from "../shared/types/api/user";
import { BaseError } from "../shared/errors/BaseError";
import { APP_MESSAGES } from "../shared/constants/messages";

export class UserService {
  static async updateMyProfile(data: UpdateMyProfileRequest): Promise<UserProfileApi> {
    try {
      const response = await UserApi.updateMyProfile(data);
      return response.data as UserProfileApi;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async applyForMentor(): Promise<UserProfileApi> {
    try {
      const response = await UserApi.applyForMentor();
      return response.data as UserProfileApi
    } catch (error) {
      this.handleError(error)
    }
  }

  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const msg = error.response?.data?.message || APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
      const status = error.response?.status;
      throw new BaseError(msg, status);
    }
    if (error instanceof Error) {
      throw new BaseError(error.message);
    }

    throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
  }
}
