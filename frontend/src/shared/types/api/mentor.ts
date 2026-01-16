import type { PaginatedResponse } from "../core";

import type { ExperienceApi } from "./auth";

export interface CreateMentorAvailabilityRequest {
    mentorId: string;
    rrule: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes?: number;
    slotPrice:number;
}

export interface MentorAvailabilityResponse {
    id: string;
    mentorId: string;
    rrule: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    amount:number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface MentorListingParams {
    search?: string;
    page?: number;
    limit?: number;
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
}

export type PaginatedMentorListResponse = PaginatedResponse<MentorListItemAPI>;

