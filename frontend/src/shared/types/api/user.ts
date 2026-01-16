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
  experience: ExperienceApi[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus: "none" | "pending" | "approved";
  primaryExpertise?: string;
  experienceLevel?: string;
};
