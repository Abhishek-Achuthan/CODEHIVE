export const APP_MESSAGES = {
  COMMON: {
    NOT_AUTHENTICATED: 'Not authenticated',
    EMAIL_REQUIRED: 'Email is required',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    UNEXPECTED_ERROR: 'Unexpected error',
  },
  AUTH: {
    REFRESH_TOKEN_MISSING: 'No new Token returned from refresh endpoint',
  },
  PROFILE: {
    INVALID_IMAGE_TYPE: 'Please select a JPG, PNG, or WEBP image',
    IMAGE_TOO_LARGE: 'Image must be 5MB or less',
    CLOUDINARY_NOT_CONFIGURED:
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET',
    IMAGE_UPLOAD_FAILED: 'Failed to upload image',
    SECURE_URL_MISSING: 'Cloudinary upload did not return a secure URL',
    AVATAR_UPDATED: 'Avatar updated',
    AVATAR_UPDATE_FAILED: 'Failed to update avatar',
    INVALID_CROP_STATE: 'Invalid crop state',
    CANVAS_CONTEXT_MISSING: 'Canvas context missing',
    CROP_FAILED: 'Crop failed',
  },
  SESSION: {
    SESSION_ID_REQUIRED: 'sessionId is required',
    CANCEL_FAILED: 'Failed to cancel session',
    CANCEL_SUCCESS: 'Session cancelled successfully',
    CANCEL_ERROR: 'Something went wrong while cancelling the session',
    LOAD_FAILED: 'Failed to load sessions',
  },
  QNA: {
    ANSWERED_QUESTIONS_FETCH_FAILED: 'Error fetching answered questions',
    SAVED_QUESTIONS_LOAD_FAILED: 'Failed to load saved questions',
    SAVED_LIST_CREATE_FAILED: 'Failed to create list',
    SAVED_LIST_ADD_SUCCESS: 'Added to list',
    SAVED_LIST_ADD_FAILED: 'Failed to add to list',
    SAVED_LIST_REMOVE_SUCCESS: 'Removed from list',
    SAVED_LIST_REMOVE_FAILED: 'Failed to remove from list',
  },
  MENTOR: {
    INVALID_MENTOR_ID: 'Invalid mentor ID',
    PROFILE_LOAD_FAILED: 'Failed to load mentor profile',
    ONE_TIME_DATE_REQUIRED: 'Date is required for one-time availability',
  },
} as const;
