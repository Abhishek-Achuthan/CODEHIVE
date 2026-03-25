import { HttpStatus } from '../../shared/httpStatusCode';
import { BaseError } from './BaseError';

export class TooManyRequestError extends BaseError {
  constructor(
    message = 'Too many requests please try again later',
    statusCode = HttpStatus.TooManyRequests
  ) {
    super(message, statusCode);
  }
}
