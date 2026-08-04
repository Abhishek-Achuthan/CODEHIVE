import { BaseError } from './BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export class ForbiddenError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.AUTH.FORBIDDEN,
    statusCode = HttpStatus.Forbidden
  ) {
    super(message, statusCode);
  }
}
