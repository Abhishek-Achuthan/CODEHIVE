import { BaseError } from './BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export class InternalServerError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
    statuscode = HttpStatus.InternalServerError
  ) {
    super(message, statuscode);
  }
}
