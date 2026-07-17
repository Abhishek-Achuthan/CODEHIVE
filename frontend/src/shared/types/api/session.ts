import type {
    AvailableSlotResponse,
    MentorBookingFallback,
} from "./mentor";

export interface UserSummary {
    id: string;
    firstName: string;
    lastName: string;
}

export interface SessionResponse {
    id: string;
    mentorId: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    paymentSource: 'STRIPE' | 'WALLET';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    paymentReferenceId: string | null;
    topic: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface BookSessionRequest {
    mentorId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    clientRequestId: string;
}

export interface BookingReservationResponse {
    id: string;
    status: 'PENDING_PAYMENT' | 'PROCESSING' | 'FULFILLED' | 'FAILED' | 'EXPIRED';
    expiresAt: string;
    sessionId: string | null;
    refundStatus: 'NONE' | 'REQUIRED' | 'PENDING' | 'REFUNDED' | 'FAILED';
}

export interface StripeBookSessionResponse {
    reservation: BookingReservationResponse;
    clientSecret: string;
    paymentIntentId: string;
    expiresAt: string;
}

export interface BookedSessionResponse extends SessionResponse {
    mentor: UserSummary;
    user: UserSummary;
    roomId?: string;
    sessionType: 'ONE_TO_ONE' | 'PRIVATE_SESSION';
    maxGuests: number;
    joinUrl?: string;
}

export type SessionRole = "mentor" | "mentee" | "all";

import type { PaginatedResponse } from "../core/api";

export type PaginatedBookedSessionResponse = PaginatedResponse<BookedSessionResponse>;

export interface BookedSessionsParams {
    role?: SessionRole;
    page?: number;
    limit?: number;
    search?: string;
    filter?: {
        status?: "upcoming" | "completed" | "cancelled";
        dateFrom?: string;
        dateTo?: string;
        paymentSource?: "STRIPE" | "WALLET";
        refundableNow?: boolean;
    };
}

export interface BookingPageLocationState {
    mentor?: MentorBookingFallback;
}

export interface PaymentPageState {
    mentorId: string;
    mentor?: MentorBookingFallback;
    slot: AvailableSlotResponse;
    date: string;
    topic: string;
    clientRequestId: string;
}
