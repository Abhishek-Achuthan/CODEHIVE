import { BaseError } from "./BaseError";
import { HttpStatus } from "../../shared/httpStatusCode";

export class ConflictError extends BaseError {
  constructor(message = "Conflict Error", statuscode = HttpStatus.Conflict) {
    super(message, statuscode);
  }
}
