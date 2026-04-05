import type { PaginatedResponse } from "../core";

import type { ExperienceApi } from "./auth";

export interface CreateMentorAvailabilityRequest {
    mentorId: string;
    rrule: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes?: number;
    slotPrice: number;
}

export interface MentorAvailabilityResponse {
    id: string;
    mentorId: string;
    rrule: string;
    exdates: string[];
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    slotPrice: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface MentorListingParams {
    search?: string;
    page?: number;
    limit?: number;
    filter?: {
        primaryExpertise?: string;
        experienceLevel?: string;
        skillsAny?: string[];
        slotPriceMin?: number;
        slotPriceMax?: number;
        hasActiveAvailability?: boolean;
    };
}

export interface AvailableSlotResponse {
    startTime: string;
    endTime: string;
    price: number;
}


export interface MentorListItemAPI {
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
    mentorStatus: "none" | "pending" | "approved";
    primaryExpertise?: string;
    experienceLevel?: string;
}

export interface MentorProfileResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    about?: string;
    skills: string[];
    experience: ExperienceApi[];
    avatarUrl?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
    primaryExpertise?: string;
    experienceLevel?: string;
}

export interface MentorSummary {
    id: string;
    firstName: string;
    lastName: string;
    title?: string;
    avatarUrl?: string;
    primaryExpertise?: string;
}

export interface MentorCardData extends MentorSummary {
    experienceLevel?: string;
    rating?: number;
}

export type MentorBookingFallback = Partial<MentorProfileResponse> & MentorSummary;

export type PaginatedMentorListResponse = PaginatedResponse<MentorListItemAPI>;
