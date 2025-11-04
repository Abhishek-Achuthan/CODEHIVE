import { BaseError } from "./BaseError";
import { HttpStatus } from "../../shared/httpStatusCode";

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden Error", statusCode = HttpStatus.Forbidden) {
    super(message, statusCode);
  }
}
