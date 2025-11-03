import { HttpStatus } from "../../shared/httpStatusCode";
import { BaseError } from "./BaseError";


export class BadRequestError extends BaseError {
    constructor(message = 'Bad Request',statusCode = HttpStatus.BadRequest) {
        super(message,statusCode);
    }
}