import type { PaginatedResponse } from "../core/api";
import type { FeatureKey, LimitKey } from "../view/PlanView";

export interface AdminUserListItemApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt?: string;
  banExpirationDate?: string | null;
  banReason?: string | null;
  bannedAt?: string | null;
  warnCount?: number;
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

export interface PlanApiResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  features: FeatureKey[];
  limits: Partial<Record<LimitKey, number>>;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ListPlansApiResponse = PaginatedResponse<PlanApiResponse>;
