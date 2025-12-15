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
    EDIT_QUESTION: (questionId:string) =>`qna/questions/${questionId}`,

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
  },
};
