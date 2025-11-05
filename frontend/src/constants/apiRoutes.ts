export const API_ROUTES = {
  AUTH: {
    USER_REGISTER: '/auth/users',
    USER_LOGIN: '/auth/sessions',
    USER_SEND_OTP: '/auth/otps',
    USER_RESEND_OTP: (id: string) => `/auth/otps/${id}/resend`,
    USER_FORGOT_PASSWORD: '/auth/forgot-password',
    USER_LOGOUT: '/auth/sessions',
    REFRESH_TOKEN: '/auth/refresh',
    USER_FORGOT_VERIFY_OTP: '/auth/forgot-password/verify-otp',
    USER_RESET_PASSWORD: '/auth/reset-password',
    USER_GOOGLE_LOGIN : '/auth/google-login'
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
        sort: params.sort ?? 'createdAt',
        search: params.search ?? '',
      });
      return `/admin/users?${query.toString()}`;
    },
    UPDATE_USER_STATUS :  `/admin/update-user-status`
  },
};
