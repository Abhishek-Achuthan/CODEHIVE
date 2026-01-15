import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreateMentorAvailabilityRequest, MentorListingParams} from "../../shared/types/api/mentor";

export const setAvailability = (data: Omit<CreateMentorAvailabilityRequest, 'mentorId'>) =>
    apiClient.post(API_ROUTES.MENTOR.SET_AVAILABILITY, data);

export const getAvailability = (mentorId: string, date: string) =>
    apiClient.get(`${API_ROUTES.MENTOR.GET_AVAILABILITY(mentorId)}?date=${date}`);

export const listMentors = (params?: MentorListingParams) => {
    const url = API_ROUTES.MENTOR.LIST_MENTORS(params);
    return apiClient.get(url);
};



