import { formatRoomAccessError } from '../../features/room/authorization/lifecycleMessages';

export const toErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return formatRoomAccessError(error.response.data.message);
  }

  const fallback = error instanceof Error ? error.message : 'Something went wrong';
  return formatRoomAccessError(fallback);
};
