import type { ExperienceApi } from "./auth";
import type { UserLanguage } from "../domain/language.types";

export type UpdateMyProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  about?: string;
  skills?: string[];
  languages?: UserLanguage[];
  experience?: ExperienceApi[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  primaryExpertise?: string;
  experienceLevel?: string;
};

export type UserProfileApi = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  about?: string;
  skills: string[];
  languages: UserLanguage[];
  experience: ExperienceApi[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus: "none" | "pending" | "approved";
  primaryExpertise?: string;
  experienceLevel?: string;
  hasPassword: boolean;
};
