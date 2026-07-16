import type { MentorStatus, UserRole } from "../../constants/auth";
import type { UserLanguage } from "../domain/language.types";

export interface CurrentUserView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isBlocked: boolean;
  avatarUrl?: string;
  about?: string;
  skills?: string[];
  languages?: UserLanguage[];
  experience?: {
    id: string;
    type: "job" | "freelance" | "open_source" | "teaching" | "self_learning";
    title: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }[];
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus?: MentorStatus;
  mentorAppliedAt?: string;
  primaryExpertise?: string;
  experienceLevel?: string;
}
