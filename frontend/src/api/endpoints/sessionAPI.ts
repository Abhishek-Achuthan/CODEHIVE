import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { BookSessionRequest } from "../../shared/types/api/session";

export const bookSessionWithStripe = (data: BookSessionRequest) =>
    apiClient.post(API_ROUTES.SESSION.BOOK_SESSION_STRIPE, data);

export const bookSessionWithWallet = (data: BookSessionRequest) =>
    apiClient.post(API_ROUTES.SESSION.BOOK_SESSION_WALLET, data);

export const getBookedSessions = () =>
    apiClient.get(API_ROUTES.SESSION.GET_BOOKED_SESSIONS);

export const getBookingReservation = (reservationId: string) =>
    apiClient.get(API_ROUTES.SESSION.GET_BOOKING_RESERVATION(reservationId));

export const cancelSession = (sessionId:string) => 
    apiClient.delete(API_ROUTES.SESSION.CANCEL_SESSION(sessionId));


