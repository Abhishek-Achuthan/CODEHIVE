import type { PaginatedResponse } from "../core";

import type { ExperienceApi } from "./auth";

export interface CreateMentorAvailabilityRequest {
    mentorId: string;
    rrule: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes?: number;
}

export interface MentorAvailabilityResponse {
    id: string;
    mentorId: string;
    rrule: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BookSessionRequest {
    mentorId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
}

export interface SessionResponse {
    id: string;
    mentorId: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    topic: string;
    amountPaid: number;
    refunded: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserSummary {
    id: string;
    firstName: string;
    lastName: string;
}

export interface BookedSessionResponse extends SessionResponse {
    mentor: UserSummary;
    user: UserSummary;
}

export interface MentorListingParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface AvailableSlotResponse {
    startTime: string;
    endTime: string;
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

