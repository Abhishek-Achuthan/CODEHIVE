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

export const updateUserStatus = (id: string, status: boolean) => apiClient.patch(API_ROUTES.ADMIN.UPDATE_USER_STATUS, { id, status });

export const getMentorApplications = (
  page?: number,
  pageSize?: number,
  search?: string
) => {
  const url = API_ROUTES.ADMIN.MENTOR_APPLICATIONS({ page, pageSize, search });
  return apiClient.get(url);
};

export const updateMentorStatus = (id: string, status: 'approved' | 'rejected') =>
  apiClient.patch(API_ROUTES.ADMIN.UPDATE_MENTOR_STATUS, { id, status });

export const getReports = (page?: number, limit?: number) => {
  return apiClient.get(API_ROUTES.ADMIN.REPORTS({ page, limit }));
};

export const updateReportStatus = (id: string, status: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.UPDATE_REPORT_STATUS(id), { status });
};

export const getRoomChatHistory = (roomId: string) => {
  return apiClient.get(API_ROUTES.ADMIN.ROOM_CHAT_HISTORY(roomId));
};

export const banUser = (userId: string, durationInDays: number | null, reason: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.BAN_USER(userId), { durationInDays, reason });
};

export const unbanUser = (userId: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.UNBAN_USER(userId));
};

export const warnUser = (userId: string, reason: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.WARN_USER(userId), { reason });
};
