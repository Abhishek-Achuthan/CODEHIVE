import apiClient from "../apiClient";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { UpdateMyProfileRequest } from "../../shared/types/api/user";

export const updateMyProfile = (data: UpdateMyProfileRequest) =>
  apiClient.patch(API_ROUTES.USER.UPDATE_MY_PROFILE, data);

export const applyForMentor = () => 
  apiClient.post(API_ROUTES.USER.APPLY_FOR_MENTOR);

export const getMyActivity = () =>
  apiClient.get(API_ROUTES.USER.GET_MY_ACTIVITY);

