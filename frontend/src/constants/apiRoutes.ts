export const API_ROUTES = {
  AUTH: {
    USER_REGISTER: '/auth/users',
    USER_LOGIN: '/auth/sessions',
    USER_SEND_OTP: '/auth/otps',
    USER_RESEND_OTP: (id: string) => `/auth/otps/${id}/resend`,
    USER_FORGOT_PASSWORD: '/auth/forgot-password',
    USER_LOGOUT: '/auth/sessions',
    REFRESH_TOKEN: '/auth/refresh',
    USER_FORGOT_VERIFY_OTP: '/auth/forgot-password/verify-otp'
  }
};
