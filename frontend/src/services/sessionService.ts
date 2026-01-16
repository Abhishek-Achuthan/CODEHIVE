import type {
    BookedSessionResponse,
    BookSessionRequest,
    SessionResponse,
    StripeBookSessionResponse
} from "../shared/types/api/session";
import * as SessionAPI from '../api/endpoints/sessionAPI'
import { AxiosError } from "axios";
import { BaseError } from "../shared/errors/BaseError";


export class SessionService {

    static async bookSessionWithWallet(data: BookSessionRequest): Promise<SessionResponse> {
        try {
            const response = await SessionAPI.bookSessionWithWallet(data);
            return response.data as SessionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async bookSessionWithStripe(data: BookSessionRequest): Promise<StripeBookSessionResponse> {
        try {
            const response = await SessionAPI.bookSessionWithStripe(data);
            return response.data as StripeBookSessionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getBookedSessions(): Promise<BookedSessionResponse[]> {
        try {
            const response = await SessionAPI.getBookedSessions();
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