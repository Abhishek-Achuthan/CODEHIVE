import type {
    BookingReservationResponse,
    BookedSessionsParams,
    BookSessionRequest,
    SessionResponse,
    StripeBookSessionResponse,
    PaginatedBookedSessionResponse
} from "../shared/types/api/session";
import * as SessionAPI from '../api/endpoints/sessionAPI'
import { AxiosError, HttpStatusCode } from "axios";
import { BaseError } from "../shared/errors/BaseError";
import { APP_MESSAGES } from "../shared/constants/messages";


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

    static async getBookedSessions(params?: BookedSessionsParams): Promise<PaginatedBookedSessionResponse> {
        try {
            const response = await SessionAPI.getBookedSessions(params);
            return response.data as PaginatedBookedSessionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getBookingReservation(reservationId: string): Promise<BookingReservationResponse> {
        try {
            const response = await SessionAPI.getBookingReservation(reservationId);
            return response.data as BookingReservationResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async cancelSession(sessionId : string): Promise<boolean> {
        try {
            const response = await SessionAPI.cancelSession(sessionId);

            return (
                response.status >= HttpStatusCode.Ok &&
                response.status < HttpStatusCode.MultipleChoices
            );
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: unknown): never {
            if (error instanceof AxiosError) {
                const msg =
                    error.response?.data.message || APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
                const status = error.response?.status;
                throw new BaseError(msg, status);
            }
            if (error instanceof Error) {
                throw new BaseError(error.message);
            }
            throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
        }

}
