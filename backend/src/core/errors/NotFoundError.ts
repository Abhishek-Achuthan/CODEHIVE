import { HttpStatus } from '../../shared/httpStatusCode';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found Error', statusCode = HttpStatus.NotFound) {
    super(message, statusCode);
  }
}
