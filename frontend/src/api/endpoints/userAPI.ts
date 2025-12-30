import apiClient from "../apiClient";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { UpdateMyProfileRequest } from "../../shared/types/api/user";

export const updateMyProfile = (data: UpdateMyProfileRequest) =>
  apiClient.patch(API_ROUTES.USER.UPDATE_MY_PROFILE, data);
