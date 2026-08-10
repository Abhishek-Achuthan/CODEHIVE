export const ERROR_MESSAGES = {
  // Generic erros
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_EMAIL: 'Invalid email address',
    USER_NOT_FOUND: 'User not found',
    ACCOUNT_BLOCKED: 'Your account is blocked',
    PASSWORD_NOT_SET:
      'This account does not have a password. Please sign in using Google or set a password first.',
    PASSWORD_ALREADY_SET: 'Password already set for this account.',
    INVALID_PASS:'Invalid Password',


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
    ID_REQUIRED: 'User ID is required',
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
    SESSION_BOOKING_NOT_ALLOWED: 'Session booking is not available on your current plan.',
  },

  ROOM: {
    UNAUTHORIZED: 'Unauthorized',
    TITLE_REQUIRED: 'Room title is required',
    TITLE_TOO_LONG: 'Room title cannot exceed 40 characters',
    USER_NOT_IN_ROOM: 'User is not part of this room',
    MESSAGE_EMPTY: 'Message cannot be empty',
    MESSAGE_NOT_FOUND: 'Message not found',
    NOT_ALLOWED_TO_EDIT_MESSAGE: 'You are not allowed to edit this message',
    NOT_ALLOWED_TO_DELETE_MESSAGE: 'You are not allowed to delete this message',
    ROOM_NOT_FOUND: 'Room not found',
    ROOM_FULL: 'Room is full',
    ACCESS_DENIED: 'You are not allowed to access this room',
    PARTICIPANT_NOT_FOUND: 'Participant not found in this room',
    FORBIDDEN: 'You are not allowed to view these notes',
    ACTIVE_ROOM_LIMIT_REACHED: 'Active room limit reached for your current plan.',
    PRIVATE_ROOM_NOT_ALLOWED: 'Private rooms are not available on your current plan.',
    INVITE_REQUIRED: 'An invite link is required to join this room',
    INVITE_INVALID: 'This invite link is invalid or has been revoked',
    INVITE_EXPIRED: 'This invite link has expired',
    INVITE_MAX_USES_REACHED: 'This invite link has reached its maximum number of uses',
    REMOVED_FROM_ROOM: 'You were removed from this room and cannot rejoin with this link',
    ONLY_HOST_CAN_MANAGE_INVITES: 'Only the room host can manage invite links',
    ONLY_HOST_CAN_KICK: 'Only the room host can remove participants',
    CANNOT_KICK_HOST: 'The host cannot be removed from the room',
    CANNOT_KICK_SELF: 'Use leave room instead of removing yourself',
    CANNOT_OVERRIDE_HOST: 'The host\'s permissions cannot be overridden',
    ONLY_CUSTOM_ROOMS_CAN_BE_ENDED: 'Only custom rooms can be ended manually',
    CANNOT_END_ROOM: 'This room cannot be ended in its current state',
  },

  POLL: {
    POLL_CLOSED: 'Poll is closed',
    POLL_NOT_FOUND: 'Poll not found',
    POLL_EXPIRED: 'Poll has expired',
    POLL_ONE_OPTION: 'This poll allows one option only',
    INVALID_POLL_OPTION: 'Invalid poll option',
    POLL_CREATOR_ONLY: 'Only poll creator can close the poll',
  },

  COLLABORATION: {
    INVALID_DOCUMENT_NAME: 'Invalid collaboration document name',
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

  PLAN: {
    ALREADY_EXIST: 'Plan with this slug already exists',
    NOT_FOUND: 'Plan not found',
    UPDATE_FAILED: 'Failed to update plan',
    FREE_PLAN_NOT_FOUND: 'Free plan not found',
    INACTIVE: 'Plan is inactive',
    FREE_PLAN_CANNOT_BE_PURCHASED: 'Free plan cannot be purchased',
    STRIPE_PRICE_NOT_CONFIGURED: 'Stripe monthly price not configured for this plan',
    STRIPE_YEARLY_PRICE_NOT_CONFIGURED: 'Stripe yearly price not configured for this plan',
    STRIPE_CATALOG_SYNC_FAILED: 'Failed to sync plan with Stripe billing catalog',
    STRIPE_PRODUCT_CREATE_FAILED: 'Failed to create Stripe product for plan',
    STRIPE_PRICE_CREATE_FAILED: 'Failed to create Stripe price for plan',
  },

  SUBSCRIPTION: {
    ALREADY_ACTIVE: 'You already have an active subscription',
    SAME_PLAN_ACTIVE: 'You are already subscribed to this plan',
  },
};
