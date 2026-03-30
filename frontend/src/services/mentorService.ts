import { AxiosError } from 'axios';
import * as MentorshipApi from '../api/endpoints/mentorAPI';
import { BaseError } from '../shared/errors/BaseError';
import type {
    CreateMentorAvailabilityRequest,
    MentorAvailabilityResponse,
    MentorListingParams,
    MentorProfileResponse,
    PaginatedMentorListResponse,
    AvailableSlotResponse
} from '../shared/types/api/mentor';

export class MentorshipService {
    static async getMentorProfile(id: string): Promise<MentorProfileResponse> {
        try {
            const response = await MentorshipApi.getMentorProfile(id);
            return response.data as MentorProfileResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async setAvailability(data: Omit<CreateMentorAvailabilityRequest, 'mentorId'>): Promise<MentorAvailabilityResponse> {
        try {
            const response = await MentorshipApi.setAvailability(data);
            return response.data as MentorAvailabilityResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getMyAvailability(): Promise<MentorAvailabilityResponse[]> {
        try {
            const response = await MentorshipApi.getMyAvailability();
            return (Array.isArray(response.data) ? response.data : []) as MentorAvailabilityResponse[];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteAvailability(id: string): Promise<void> {
        try {
            await MentorshipApi.deleteAvailability(id);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async addException(id: string, date: string): Promise<MentorAvailabilityResponse> {
        try {
            const response = await MentorshipApi.addException(id, date);
            return response.data.data as MentorAvailabilityResponse;
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
