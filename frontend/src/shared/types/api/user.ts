import type { ExperienceApi } from "./auth";

export type UpdateMyProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  about?: string;
  skills?: string[];
  experience?: ExperienceApi[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
};

export type UserProfileApi = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  about?: string;
  skills: string[];
  experience: ExperienceApi[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus: "none" | "pending" | "approved";
};
