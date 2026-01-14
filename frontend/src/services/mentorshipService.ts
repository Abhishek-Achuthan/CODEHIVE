import { AxiosError } from 'axios';
import * as MentorshipApi from '../api/endpoints/mentorshipAPI';
import { BaseError } from '../shared/errors/BaseError';
import type {
    CreateMentorAvailabilityRequest,
    MentorAvailabilityResponse,
    BookSessionRequest,
    SessionResponse,
    BookedSessionResponse,
    MentorListingParams,
    PaginatedMentorListResponse,
    AvailableSlotResponse
} from '../shared/types/api/mentorship';

export class MentorshipService {
    static async setAvailability(data: Omit<CreateMentorAvailabilityRequest, 'mentorId'>): Promise<MentorAvailabilityResponse> {
        try {
            const response = await MentorshipApi.setAvailability(data);
            return response.data as MentorAvailabilityResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getAvailability(mentorId: string, date: string): Promise<AvailableSlotResponse[]> {
        try {
            const response = await MentorshipApi.getAvailability(mentorId, date);
            return (Array.isArray(response.data) ? response.data : []) as AvailableSlotResponse[];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listMentors(params?: MentorListingParams): Promise<PaginatedMentorListResponse> {
        try {
            const response = await MentorshipApi.listMentors(params);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async bookSession(data: BookSessionRequest): Promise<SessionResponse> {
        try {
            const response = await MentorshipApi.bookSession(data);
            return response.data as SessionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getBookedSessions(): Promise<BookedSessionResponse[]> {
        try {
            const response = await MentorshipApi.getBookedSessions();
            return (Array.isArray(response.data) ? response.data : []) as BookedSessionResponse[];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: unknown): never {
        if (error instanceof AxiosError) {
            const msg = error.response?.data.message || 'Something went wrong';
            const status = error.response?.status;
            throw new BaseError(msg, status);
        }
        if (error instanceof Error) {
            throw new BaseError(error.message);
        }
        throw new BaseError('Unexpected error');
    }
}
