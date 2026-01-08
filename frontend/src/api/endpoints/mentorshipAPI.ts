import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreateMentorAvailabilityRequest, MentorListingParams, BookSessionRequest } from "../../shared/types/api/mentorship";

export const setAvailability = (data: Omit<CreateMentorAvailabilityRequest, 'mentorId'>) =>
    apiClient.post(API_ROUTES.MENTORSHIP.SET_AVAILABILITY, data);

export const getAvailability = (mentorId: string, date: string) =>
    apiClient.get(`${API_ROUTES.MENTORSHIP.GET_AVAILABILITY(mentorId)}?date=${date}`);

export const listMentors = (params?: MentorListingParams) => {
    const url = API_ROUTES.MENTORSHIP.LIST_MENTORS(params);
    return apiClient.get(url);
};

export const bookSession = (data: BookSessionRequest) =>
    apiClient.post(API_ROUTES.MENTORSHIP.BOOK_SESSION, data);

export const getBookedSessions = () =>
    apiClient.get(API_ROUTES.MENTORSHIP.GET_BOOKED_SESSIONS);

