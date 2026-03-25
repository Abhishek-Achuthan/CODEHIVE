import { BaseError } from './BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';

export class InternalServerError extends BaseError {
  constructor(message = 'Internal Server Error', statuscode = HttpStatus.InternalServerError) {
    super(message, statuscode);
  }
}
