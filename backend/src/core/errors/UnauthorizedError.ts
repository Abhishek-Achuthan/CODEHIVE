import { HttpStatus } from '../../shared/httpStatusCode';
import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(
    message = 'Unauthorized Error',
    statusCode = HttpStatus.Unauthorized
  ) {
    super(message, statusCode);
  }
}
