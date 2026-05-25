import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../../core/errors/BaseError';
import { HttpStatus } from '../../shared/httpStatusCode';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { loggerService } from '../../config/di/resolver';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof ZodError) {
    const errorDetails = err.issues.map((issue) => ({
      path: issue.path.length ? issue.path.join('.') : '<root>',
      message: issue.message,
    }));

    const errorMessages = errorDetails
      .map((d) => `${d.path}: ${d.message}`)
      .join(', ');

    loggerService.error('Validation Error:', {errors: errorMessages});

    return res.status(HttpStatus.BadRequest).json({
      success: false,
      message: ERROR_MESSAGES.SERVER.VALIDATION_FAILED,
      errors: errorDetails,
    });
  }

  if (err instanceof BaseError) {

    loggerService.error('Base Error:', {error: err.stack});

    return res.status(err._statusCode).json({
      success: false,
      message: err.message,
    });
  }

  loggerService.error('Internal Server Error:', {error : err});

  return res.status(HttpStatus.InternalServerError).json({
    success: false,
    message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
  });
}
