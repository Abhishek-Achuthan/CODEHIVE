export const ERROR_MESSAGES = {
  // Generic erros
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_EMAIL: 'Invalid email address',
    USER_NOT_FOUND: 'User not found',
    ACCOUNT_BLOCKED: 'Your account is blocked',
    PASSWORD_NOT_SET:
      'This account does not have a password. Please sign in using Google or set a password first.',

    // Token errors
    MISSING_REFRESH_TOKEN: 'Missing refresh token',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_REFRESH_TOKEN_PAYLOAD: 'Invalid refresh token payload',
    INVALID_TOKEN: 'Invalid token',
    MISSING_TOKEN_EXPIRATION: 'Missing token or expiration time',

    // HTTP errors
    UNAUTHORIZED: 'Unauthorized access',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    FORBIDDEN: 'Access denied',

    // OAuth errors
    MISSING_OR_INVALID_AUTH_CODE: 'Missing or invalid authorization code',
  },

  // Google errors
  GOOGLE: {
    MISSING_ENV:
      'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables',
    INVALID_TOKEN: 'Invalid or missing Google ID token',
    INVALID_PAYLOAD: 'Invalid Google token payload',
    ACCESS_TOKEN_FAILED: 'Failed to retrieve Google access token',
    USER_EMAIL_NOT_FOUND: 'No email found for Google user',
    INVALID_CREDENTIALS: 'Invalid Google credentials',
  },

  // Github errors
  GITHUB: {
    MISSING_ENV:
      'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment variables',
    ACCESS_TOKEN_FAILED: 'Failed to retrieve GitHub access token',
    USER_EMAIL_NOT_FOUND: 'No email found for GitHub user',
    INVALID_CREDENTIALS: 'Invalid GitHub credentials',
  },

  // OTP errors
  OTP: {
    INVALID_OTP: 'Invalid or expired OTP',
    OTP_EXPIRED: 'OTP has expired, please request a new one',
    ALREADY_SENT: 'OTP already sent. Please wait before requesting another one',
  },

  // User related error
  USER: {
    ALREADY_EXIST: 'User already exist',
    NOT_FOUND: 'User not found',
    UPDATE_FAILED: 'Failed to update user status',
  },

  // Server errors
  SERVER: {
    INTERNAL_ERROR: 'Internal Server Error',
  },

  //QnA errors

  QnA: {
    NOT_FOUND: 'Question not Found',
    ALREADY_ANSWERED:
      'This question alredy has an accepted answer.No further answers are allowed.',
    NOT_ALLOWED_TO_EDIT_QUESTION: 'Not allowed to edit this question',
    ANSWER_NOT_FOUND: 'Answer not found',
    ANSWER_VERSION_CONFLICT:
      'Answer has been modified. Please refresh and try again.',
    NOT_ALLOWED_TO_EDIT_ANSWER: 'You are not allowed to edit this answer',
  },

  // Session errors
  
  SESSION: {
    MENTOR_NOT_FOUND: 'Mentor not found',
    MENTOR_NOT_APPROVED: 'Mentor is not approved yet',
    NO_AVAILABILITY: 'Mentor has no availability',
    SLOT_NOT_AVAILABLE: 'Selected slot is no longer available',
    SESSION_NOT_FOUND: 'Session not found',
    ACCESS_DENIED: 'You are not allowed to access this session',
  },
};
