import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { BaseError } from './BaseError';


export class BadRequestError extends BaseError {
    constructor(
        message = ERROR_MESSAGES.SERVER.BAD_REQUEST,
        statusCode = HttpStatus.BadRequest
    ) {
        super(message,statusCode);
    }
}
