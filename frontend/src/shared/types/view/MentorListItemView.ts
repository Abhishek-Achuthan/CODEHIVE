import type { ExperienceApi } from "../api/auth";

export interface MentorListItemView {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    about?: string;
    skills: string[];
    experience: ExperienceApi[];
    avatarUrl?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
}
