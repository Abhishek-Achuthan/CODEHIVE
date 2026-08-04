import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.SERVER.NOT_FOUND,
    statusCode = HttpStatus.NotFound
  ) {
    super(message, statusCode);
  }
}
