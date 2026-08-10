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
  _next: NextFunction
) {

  if (err instanceof ZodError) {
    const errorDetails = err.issues.map((issue) => ({
      path: issue.path.length ? issue.path.join('.') : '<root>',
      message: issue.message,
    }));

    const errorMessages = errorDetails
      .map((d) => `${d.path}: ${d.message}`)
      .join(', ');

    loggerService.error('Validation Error', {
      path: req.path,
      method: req.method,
      errors: errorMessages,
    });

    return res.status(HttpStatus.BadRequest).json({
      success: false,
      message: ERROR_MESSAGES.SERVER.VALIDATION_FAILED,
      errors: errorDetails,
    });
  }

  if (err instanceof BaseError) {

    loggerService.error(`${err.name}: ${err.message}`, {
      statusCode: err._statusCode,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });

    return res.status(err._statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const internalMessage =
    err instanceof Error ? err.message : String(err);
  const internalStack = err instanceof Error ? err.stack : undefined;

  loggerService.error(`Internal Server Error: ${internalMessage}`, {
    path: req.path,
    method: req.method,
    stack: internalStack,
  });

  return res.status(HttpStatus.InternalServerError).json({
    success: false,
    message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
  });
}
