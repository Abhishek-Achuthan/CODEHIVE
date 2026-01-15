import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { BookSessionRequest } from "../../shared/types/api/session";

export const bookSession = (data: BookSessionRequest) =>
    apiClient.post(API_ROUTES.SESSION.BOOK_SESSION, data);

export const getBookedSessions = () =>
    apiClient.get(API_ROUTES.SESSION.GET_BOOKED_SESSIONS);