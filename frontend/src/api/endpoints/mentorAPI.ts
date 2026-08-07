import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreateMentorAvailabilityRequest, MentorListingParams } from "../../shared/types/api/mentor";

export const getMentorProfile = (id: string) =>
    apiClient.get(API_ROUTES.MENTOR.GET_PROFILE(id));

export const setAvailability = (data: Omit<CreateMentorAvailabilityRequest, 'mentorId'>) =>
    apiClient.post(API_ROUTES.MENTOR.SET_AVAILABILITY, data);

export const getMyAvailability = () =>
    apiClient.get(API_ROUTES.MENTOR.GET_MY_AVAILABILITY);

export const deleteAvailability = (id: string) =>
    apiClient.delete(API_ROUTES.MENTOR.DELETE_AVAILABILITY(id));

export const addException = (id: string, date: string) =>
    apiClient.patch(API_ROUTES.MENTOR.ADD_EXCEPTION(id), { date });

export const getAvailability = (mentorId: string, date: string) =>
    apiClient.get(`${API_ROUTES.MENTOR.GET_AVAILABILITY(mentorId)}?date=${date}`);

export const listMentors = (params?: MentorListingParams) => {
    const url = API_ROUTES.MENTOR.LIST_MENTORS(params);
    return apiClient.get(url);
};

export const getMyInsights = () => 
    apiClient.get(API_ROUTES.MENTOR.GET_MY_INSIGHTS);

export const getMyReviews = (page: number = 1, limit: number = 10) => 
    apiClient.get(`${API_ROUTES.MENTOR.GET_MY_REVIEWS}?page=${page}&limit=${limit}`);
