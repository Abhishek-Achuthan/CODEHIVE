import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { BaseError } from './BaseError';

export class TooManyRequestError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.OTP.ALREADY_SENT,
    statusCode = HttpStatus.TooManyRequests
  ) {
    super(message, statusCode);
  }
}
