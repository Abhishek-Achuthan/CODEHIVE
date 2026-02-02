import type { PaginatedResponse } from "../core/api";

export interface AdminUserListItemApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt?: string;
}


export type ListUsersApiResponse = PaginatedResponse<AdminUserListItemApi>;

export interface MentorApplicationApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorStatus: string;
  mentorAppliedAt: string;
}

export type ListMentorApplicationsApiResponse = PaginatedResponse<MentorApplicationApi>;
