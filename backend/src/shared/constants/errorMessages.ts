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
    ALREADY_MENTOR: 'User is already a mentor',
    APPLY_FOR_MENTOR_FAILED: 'Failed to apply for mentor',
    ALREADY_APPLIED: 'You have already applied to be a mentor',
  },

  // Server errors
  SERVER: {
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'Internal Server Error',
    UNEXPECTED_ERROR: 'Unexpected error',
    BAD_REQUEST: 'Bad Request',
    NOT_FOUND: 'Not Found Error',
    CONFLICT: 'Conflict Error',
  },

  ADMIN: {
    INVALID_MENTOR_STATUS_REQUEST:
      'Invalid request body. Status must be "approved" or "rejected"',
  },

  // Wallet errors
  WALLET: {
    NOT_FOUND: 'Wallet not found',
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
    INVALID_AMOUNT: 'Amount must be greater than zero',
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
    ANSWER_QUESTION_MISMATCH: 'Answer is not of this question',
    LIST_NOT_FOUND: 'List not found',
    LIST_ALREADY_EXISTS: 'List already exists',
    NO_ANSWERED_QUESTIONS: 'No answered Questions Found',
    CHAT_SESSION_NOT_FOUND: 'Chat session not found',
    AI_RESPONSE_EMPTY: 'Ai response was empty',
  },

  // Session errors

  SESSION: {
    MENTOR_NOT_FOUND: 'Mentor not found',
    MENTOR_NOT_APPROVED: 'Mentor is not approved yet',
    NO_AVAILABILITY: 'Mentor has no availability',
    SLOT_NOT_AVAILABLE: 'Selected slot is no longer available',
    SESSION_NOT_FOUND: 'Session not found',
    ACCESS_DENIED: 'You are not allowed to access this session',
    NOT_ALLOWED_TO_CANCEL: 'Not allowed to cancel this session',
    ALREADY_STARTED: 'Session already started',
    ALREADY_CANCELLED: 'Session already cancelled',
    EXCEPTION_DATE_IN_PAST: 'Exception date cannot be in the past',
    AVAILABILITY_NOT_FOUND: 'Availability rule not found',
    AVAILABILITY_MODIFY_FORBIDDEN: 'You can only modify your own availability rules',
    AVAILABILITY_DELETE_FORBIDDEN: 'You can only delete your own availability rules',
    ONLY_PAID_SESSIONS_CANCELLABLE: 'Only paid sessions can be cancelled',
    ONLY_PENDING_RESERVATIONS_CANCELLABLE: 'Only pending reservations can be cancelled',
    BOOKING_RESERVATION_CANCEL_FAILED:
      'Booking reservation could not be cancelled',
    BOOKING_RESERVATION_UPDATE_FAILED:
      'Booking reservation could not be updated',
    BOOKING_RESERVATION_TRANSITION_FAILED:
      'Booking reservation state transition failed',
    WEBHOOK_PROCESSING_FAILED: 'Stripe webhook processing failed',
    REFUND_TRIGGER_FAILED: 'Refund trigger failed',
  },

  ROOM: {
    UNAUTHORIZED: 'Unauthorized',
    USER_NOT_IN_ROOM: 'User is not part of this room',
    MESSAGE_EMPTY: 'Message cannot be empty',
    ROOM_NOT_FOUND: 'Room not found',
    ROOM_FULL: 'Room is full',
  },

  UTILITY: {
    INVALID_UNIX_TIMESTAMP: 'Invalid Unix timestamp',
  },

  PAYMENT: {
    PAYMENT_INTENT_CREATE_FAILED: 'Failed to create payment intent',
    PAYMENT_INTENT_CLIENT_SECRET_FETCH_FAILED:
      'Failed to retrieve payment intent client secret',
    INVALID_STRIPE_WEBHOOK_SIGNATURE: 'Invalid Stripe webhook signature',
  },
};
