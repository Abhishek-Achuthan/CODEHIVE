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
    topic: string;
    amountPaid: number;
    refunded: boolean;
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

export interface BookedSessionResponse extends SessionResponse {
    mentor: UserSummary;
    user: UserSummary;
}