import { type MentorListingParams } from "../shared/types/api/mentor";
import { type BookedSessionsParams } from "../shared/types/api/session";
import type { AnswerListParams, QuestionListParams } from "../shared/types/api/qna";

export const API_ROUTES = {
  AUTH: {
    USER_REGISTER: "/auth/users",
    USER_LOGIN: "/auth/sessions",
    USER_SEND_OTP: "/auth/otps",
    USER_RESEND_OTP: (id: string) => `/auth/otps/${id}/resend`,
    USER_FORGOT_PASSWORD: "/auth/forgot-password",
    USER_LOGOUT: "/auth/sessions",
    REFRESH_TOKEN: "/auth/refresh",
    USER_FORGOT_VERIFY_OTP: "/auth/forgot-password/verify-otp",
    USER_RESET_PASSWORD: "/auth/reset-password",
    USER_GOOGLE_LOGIN: "/auth/google-login",
    USER_CHANGE_PASSWORD: "/auth/change-password"
  },

  USER: {
    UPDATE_MY_PROFILE: "/users/me/profile",
    APPLY_FOR_MENTOR: "/users/me/mentor-applications"
  },

  ADMIN: {
    USER_LISTING: (params: {
      role: string;
      page?: number;
      pageSize?: number;
      sort?: string;
      search?: string;
    }) => {
      const query = new URLSearchParams({
        role: params.role,
        page: (params.page ?? 1).toString(),
        pageSize: (params.pageSize ?? 10).toString(),
        sort: params.sort ?? "createdAt",
        search: params.search ?? "",
      });
      return `/admin/users?${query.toString()}`;
    },
    UPDATE_USER_STATUS: `/admin/update-user-status`,
    MENTOR_APPLICATIONS: (params: {
      page?: number;
      pageSize?: number;
      search?: string;
    }) => {
      const query = new URLSearchParams({
        currentPage: (params.page ?? 1).toString(),
        pageSize: (params.pageSize ?? 10).toString(),
        search: params.search ?? "",
      });
      return `/admin/list-applications?${query.toString()}`;
    },
    UPDATE_MENTOR_STATUS: `/admin/update-mentor-status`,
  },

  PLANS: {
    LIST: (params?: { page?: number; limit?: number; search?: string }) => {
      const qp = new URLSearchParams();
      if (params?.page !== undefined) qp.append("page", String(params.page));
      if (params?.limit !== undefined) qp.append("limit", String(params.limit));
      if (params?.search) qp.append("search", params.search);
      const query = qp.toString();
      return query ? `/plans?${query}` : `/plans`;
    },
    CREATE: `/plans`,
    UPDATE: (id: string) => `/plans/${id}`,
    ARCHIVE: (id: string) => `/plans/${id}/archive`,
    GET_BY_ID: (id: string) => `/plans/${id}`,
  },

  QnA: {
    //---------------------------Question URL----------------------------------------//

    LIST_QUESTIONS: (params?: QuestionListParams) => {
      const qp = new URLSearchParams();

      if (!params) return `/qna/questions`;

      if (params.page !== undefined) qp.append("page", String(params.page));
      if (params.limit !== undefined) qp.append("limit", String(params.limit));
      if (params.search) qp.append("search", params.search);
      if (params.sortBy) qp.append("sortBy", params.sortBy);

      if (params.filter) {
        const f = params.filter;
        if (f.tags && f.tags.length > 0)
          qp.append("filter.tags", f.tags.join(","));
        if (f.status) qp.append("filter.status", f.status);
        if (f.bookmarkedOnly !== undefined)
          qp.append("filter.bookmarkedOnly", String(f.bookmarkedOnly));
        if (f.dateFrom) qp.append("filter.dateFrom", f.dateFrom);
      }

      const query = qp.toString();
      return query ? `/qna/questions?${query}` : `/qna/questions`;
    },

    CREATE_QUESTION: "/qna/questions",
    GET_QUESTION: (questionId: string) => `/qna/questions/${questionId}`,
    RELATED_QUESTIONS: (questionId: string) =>
      `/qna/questions/${questionId}/related`,
    SAVE_QUESTION: (questionId: string) => `/qna/questions/${questionId}/save`,
    UNSAVE_QUESTION: (questionId: string) => `/qna/questions/${questionId}/save`,
    VOTE_QUESTION: (questionId: string) => `/qna/questions/${questionId}/vote`,
    EDIT_QUESTION: (questionId: string) => `qna/questions/${questionId}`,
    ANSWERED_QUESTIONS: (params?: QuestionListParams) => {

      const qp = new URLSearchParams();

      if (!params) return `/users/me/answers/questions`;

      if (params.page !== undefined) qp.append('page', String(params.page));
      if (params.limit !== undefined) qp.append('limit', String(params.limit));
      if (params.search !== undefined) qp.append('search', params.search);
      if (params.sortBy !== undefined) qp.append('sortBy', params.sortBy);

      if (params.filter) {
        const f = params.filter;
        if (f.tags && f.tags.length > 0) {
          qp.append('filter.tags', f.tags.join(','))
        }
      }

      const query = qp.toString();
      return query ? `/users/me/answers/questions?${query}` : `/users/me/answers/questions`;

    },

    MY_QUESTIONS: (userId: string, params?: QuestionListParams) => {
      const qp = new URLSearchParams();

      if (!params) return `/users/${userId}/questions`;

      if (params.page !== undefined) qp.append('page', String(params.page));
      if (params.limit !== undefined) qp.append('limit', String(params.limit));
      if (params.search !== undefined) qp.append('search', params.search);
      if (params.sortBy !== undefined) qp.append('sortBy', params.sortBy);

      if (params.filter) {
        const f = params.filter;
        if (f.tags && f.tags.length > 0) qp.append('filter.tags', f.tags.join(','));
        if (f.status) qp.append('filter.status', f.status);
        if (f.bookmarkedOnly !== undefined)
          qp.append('filter.bookmarkedOnly', String(f.bookmarkedOnly));
        if (f.dateFrom) qp.append('filter.dateFrom', f.dateFrom);
      }

      const query = qp.toString();
      return query ? `/users/${userId}/questions?${query}` : `/users/${userId}/questions`;
    },

    SAVED_LISTS: `/qna/saved/lists`,

    DELETE_SAVED_LIST: (listId: string) => `/qna/saved/lists/${listId}`,

    SAVED_QUESTIONS: (params?: QuestionListParams) => {
      const qp = new URLSearchParams();

      if (!params) return `/qna/saved/questions`;

      if (params.page !== undefined) qp.append('page', String(params.page));
      if (params.limit !== undefined) qp.append('limit', String(params.limit));
      if (params.search !== undefined) qp.append('search', params.search);
      if (params.sortBy !== undefined) qp.append('sortBy', params.sortBy);

      if (params.filter) {
        const f = params.filter;
        if (f.tags && f.tags.length > 0) qp.append('filter.tags', f.tags.join(','));
        if (f.status) qp.append('filter.status', f.status);
        if (f.bookmarkedOnly !== undefined)
          qp.append('filter.bookmarkedOnly', String(f.bookmarkedOnly));
        if (f.dateFrom) qp.append('filter.dateFrom', f.dateFrom);
      }

      const query = qp.toString();
      return query ? `/qna/saved/questions?${query}` : `/qna/saved/questions`;
    },

    SAVED_QUESTION_LIST_IDS: (questionId: string) =>
      `/qna/saved/questions/${questionId}/lists`,

    SAVED_LIST_QUESTIONS: (listId: string, params?: QuestionListParams) => {
      const qp = new URLSearchParams();

      if (!params) return `/qna/saved/lists/${listId}/questions`;

      if (params.page !== undefined) qp.append('page', String(params.page));
      if (params.limit !== undefined) qp.append('limit', String(params.limit));
      if (params.search !== undefined) qp.append('search', params.search);
      if (params.sortBy !== undefined) qp.append('sortBy', params.sortBy);

      if (params.filter) {
        const f = params.filter;
        if (f.tags && f.tags.length > 0) qp.append('filter.tags', f.tags.join(','));
        if (f.status) qp.append('filter.status', f.status);
        if (f.bookmarkedOnly !== undefined)
          qp.append('filter.bookmarkedOnly', String(f.bookmarkedOnly));
        if (f.dateFrom) qp.append('filter.dateFrom', f.dateFrom);
      }

      const query = qp.toString();
      return query
        ? `/qna/saved/lists/${listId}/questions?${query}`
        : `/qna/saved/lists/${listId}/questions`;
    },

    SAVED_LIST_ITEM: (listId: string, questionId: string) =>
      `/qna/saved/lists/${listId}/questions/${questionId}`,

    ACCEPT_ANSWER: (questionId: string) => `/qna/questions/${questionId}/accept-answer`,

    REMOVE_ACCEPTED_ANSWER: (questionId: string) =>
      `/qna/questions/${questionId}/accept-answer`,

    AI_ASSIST: `/qna/questions/ai-assist`,

    AI_SESSIONS: (params?: { limit?: number }) => {
      const qp = new URLSearchParams();
      if (params?.limit !== undefined) qp.append('limit', String(params.limit));
      const query = qp.toString();
      return query ? `/qna/questions/ai-sessions?${query}` : `/qna/questions/ai-sessions`;
    },

    AI_MESSAGES: (sessionId: string, params?: { limit?: number }) => {
      const qp = new URLSearchParams();
      if (params?.limit !== undefined) qp.append('limit', String(params.limit));
      const query = qp.toString();
      return query
        ? `/qna/questions/ai-sessions/${sessionId}/messages?${query}`
        : `/qna/questions/ai-sessions/${sessionId}/messages`;
    },

    //-------------------------------Answer URL-----------------------------------//

    LIST_ANSWERS: (params: AnswerListParams) => {
      const qp = new URLSearchParams();

      if (params.page !== undefined) qp.append("page", String(params.page));
      if (params.limit !== undefined) qp.append("limit", String(params.limit));
      if (params.sortBy) qp.append("sortBy", params.sortBy);
      if (params.search) qp.append("search", params.search);

      const query = qp.toString();

      return `/qna/questions/${params.questionId}/answers${query ? `?${query}` : ''}`;
    },

    POST_ANSWER: (questionId: string) => `/qna/questions/${questionId}/answers`,
    EDIT_ANSWER: (answerId: string) => `/qna/answers/${answerId}`,
    GET_ANSWER: (answerId: string) => `/qna/answers/${answerId}`,
    VOTE_ANSWER: (answerId: string) => `/qna/answers/${answerId}/vote`,
  },

  MENTOR: {
    GET_PROFILE: (id: string) => `/mentors/${id}`,
    SET_AVAILABILITY: "/mentors/availability",
    GET_MY_AVAILABILITY: "/mentors/me/availability",
    DELETE_AVAILABILITY: (id: string) => `/mentors/availability/${id}`,
    ADD_EXCEPTION: (id: string) => `/mentors/availability/${id}/exceptions`,
    GET_AVAILABILITY: (mentorId: string) => `/mentors/${mentorId}/available`,
    LIST_MENTORS: (params?: MentorListingParams) => {
      const qp = new URLSearchParams();
      if (params?.search) qp.append('search', params.search);
      if (params?.page) qp.append('page', String(params.page));
      if (params?.limit) qp.append('limit', String(params.limit));
      if (params?.filter?.primaryExpertise) qp.append('filter.primaryExpertise', params.filter.primaryExpertise);
      if (params?.filter?.experienceLevel) qp.append('filter.experienceLevel', params.filter.experienceLevel);
      if (params?.filter?.skillsAny && params.filter.skillsAny.length > 0) qp.append('filter.skillsAny', params.filter.skillsAny.join(','));
      if (params?.filter?.slotPriceMin !== undefined) qp.append('filter.slotPriceMin', String(params.filter.slotPriceMin));
      if (params?.filter?.slotPriceMax !== undefined) qp.append('filter.slotPriceMax', String(params.filter.slotPriceMax));
      if (params?.filter?.hasActiveAvailability !== undefined) qp.append('filter.hasActiveAvailability', String(params.filter.hasActiveAvailability));
      const query = qp.toString();
      return query ? `/mentors?${query}` : `/mentors`;
    },
  },
  SESSION: {
    BOOK_SESSION_STRIPE: "/sessions/stripe",
    BOOK_SESSION_WALLET: "/sessions/wallet",
    GET_BOOKED_SESSIONS: (params?: BookedSessionsParams) => {
      const qp = new URLSearchParams();
      if (params?.role) qp.append('role', params.role);
      if (params?.page !== undefined) qp.append('page', String(params.page));
      if (params?.limit !== undefined) qp.append('limit', String(params.limit));
      if (params?.filter?.status) qp.append('filter.status', params.filter.status);
      if (params?.filter?.dateFrom) qp.append('filter.dateFrom', params.filter.dateFrom);
      if (params?.filter?.dateTo) qp.append('filter.dateTo', params.filter.dateTo);
      if (params?.filter?.paymentSource) qp.append('filter.paymentSource', params.filter.paymentSource);
      if (params?.filter?.refundableNow !== undefined) qp.append('filter.refundableNow', String(params.filter.refundableNow));
      const query = qp.toString();
      return query ? `/sessions?${query}` : `/sessions`;
    },
    GET_BOOKING_RESERVATION: (reservationId: string) => `/sessions/reservations/${reservationId}`,
    CANCEL_SESSION: (sessionId: string) => `/sessions/${sessionId}`
  },

  WALLET: {
    GET_MY_WALLET: "/wallet/me",
    GET_WALLET_TRANSACTIONS: "/wallet/transactions",
  },

  ROOM: {
    CREATE_ROOM: "/rooms",
    GET_PUBLIC_ROOMS: (params?: { page?: number; limit?: number }) => {
      const qp = new URLSearchParams();
      if (params?.page !== undefined) qp.append("page", String(params.page));
      if (params?.limit !== undefined) qp.append("limit", String(params.limit));
      const query = qp.toString();
      return query ? `/rooms?${query}` : `/rooms`;
    },
    JOIN_ROOM: (roomId: string) => `/rooms/${roomId}/join`,
    LEAVE_ROOM: (roomId: string) => `/rooms/${roomId}/leave`,
    CREATE_MESSAGE: (roomId: string) => `/rooms/${roomId}/messages`,
    EDIT_MESSAGE: (roomId: string, messageId: string) =>
      `/rooms/${roomId}/messages/${messageId}`,
    DELETE_MESSAGE: (roomId: string, messageId: string) =>
      `/rooms/${roomId}/messages/${messageId}`,
    CREATE_POLL: (roomId: string) => `/rooms/${roomId}/polls`,
    VOTE_POLL: (roomId: string, pollId: string) =>
      `/rooms/${roomId}/polls/${pollId}/votes`,
    CLOSE_POLL: (roomId: string, pollId: string) =>
      `/rooms/${roomId}/polls/${pollId}/close`,
    GET_PRIVATE_NOTE: (roomId: string) => `/rooms/${roomId}/private-notes`,
    SAVE_PRIVATE_NOTE: (roomId: string) => `/rooms/${roomId}/private-notes`,
    GET_PUBLIC_NOTE: (roomId: string) => `/rooms/${roomId}/public-notes`,
    SAVE_PUBLIC_NOTE: (roomId: string) => `/rooms/${roomId}/public-notes`
  }
};
