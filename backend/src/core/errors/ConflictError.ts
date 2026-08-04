import { BaseError } from './BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export class ConflictError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.SERVER.CONFLICT,
    statuscode = HttpStatus.Conflict
  ) {
    super(message, statuscode);
  }
}
