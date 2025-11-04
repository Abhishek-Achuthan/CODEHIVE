import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";

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

export const updateUserStatus = (id:string,status:boolean)  => apiClient.patch(API_ROUTES.ADMIN.UPDATE_USER_STATUS,{id,status});


