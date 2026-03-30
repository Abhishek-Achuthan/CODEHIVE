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
}

export interface StripeBookSessionResponse {
    session: SessionResponse;
    clientSecret: string;
    paymentIntentId: string;
}

export interface BookedSessionResponse extends SessionResponse {
    mentor: UserSummary;
    user: UserSummary;
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
}
