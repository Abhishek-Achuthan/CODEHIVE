
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_EMAIL:'Invalid email address',
    USER_NOT_FOUND: 'User not found',
    ACCOUNT_BLOCKED: 'Your account is blocked',
    INVALID_GOOGLE_CREDENTIALS: 'Invalid Google credentials',
    INVALID_GITHUB_CREDENTIALS: 'Invalid GitHub credentials',
    MISSING_REFRESH_TOKEN: 'Missing refresh token',
    INVALID_REFRESH_TOKEN:'Invalid refresh token',
    INVALID_REFRESH_TOKEN_PAYLOAD:'Invalid refresh token payload',
    UNAUTHORIZED: 'Unauthorized access',
  },
  OTP: {
    INVALID_OTP: 'Invalid or expired OTP',
    OTP_EXPIRED: 'OTP has expired, please request a new one',
    ALREADY_SENT: 'OTP already sent. Please wait before requesting another one',
  },
  USER: {
    ALREADY_EXIST: 'User already exist',
    NOT_FOUND: 'User not found',
    UPDATE_FAILED: 'Failed to update user status',
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal Server Error',
  },
};
