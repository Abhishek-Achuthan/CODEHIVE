import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";

export const getNotifications = (page?: number, limit?: number) => {
  return apiClient.get(API_ROUTES.NOTIFICATIONS.LIST({ page, limit }));
};

export const markAsRead = (id: string) => {
  return apiClient.patch(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id));
};

export const markAllAsRead = () => {
  return apiClient.patch(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ);
};
