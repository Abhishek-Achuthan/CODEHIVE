import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    statusCode = HttpStatus.Unauthorized
  ) {
    super(message, statusCode);
  }
}
