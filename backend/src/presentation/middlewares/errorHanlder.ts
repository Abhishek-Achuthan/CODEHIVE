import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../../core/errors/BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) {
  /**
   * ZodError Handling 
   */
  if (err instanceof ZodError) {
    const errorDetails = err.issues.map((issue) => ({
      path: issue.path.length ? issue.path.join('.') : '<root>',
      message: issue.message,
    }));

    const errorMessages = errorDetails
      .map((d) => `${d.path}: ${d.message}`)
      .join(', ');

    console.error('Validation Error:', errorMessages);

    return res.status(HttpStatus.BadRequest).json({
      success: false,
      message: ERROR_MESSAGES.SERVER.VALIDATION_FAILED,
      errors: errorDetails,
    });
  }

  /**
   * Base Error Handler for defined Errors
   *  if the error is not the instance of the Base Error
   *  then it go to the Fallback Error
   */
  if (err instanceof BaseError) {
    console.error('Custom Error:', err.message, { stack: err.stack });

    return res.status(err._statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error('Internal Server Error:', err);

  return res.status(HttpStatus.InternalServerError).json({
    success: false,
    message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
  });
}
