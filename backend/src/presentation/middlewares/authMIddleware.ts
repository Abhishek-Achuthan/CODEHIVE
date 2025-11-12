import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { IJWTService } from '../../application/ports/security/IJWTService';
import { UnauthorizedError } from '../../core/errors/UnauthorizedError';
import { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

@injectable()
export class AuthMiddleware {
  constructor(
    @inject('IJWTService') private _jwtService: IJWTService,
  ) {}

  check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header('Authorization');

      if (!header?.startsWith('Bearer ')) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }

      const token = header.split(' ')[1];

      if (!token) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }

      const decoded = this._jwtService.verifyAccessToken(token) as JwtPayload;

      if (!decoded) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }

      (req as any).user = {
        id: decoded.sub,
        role: decoded.userRole,
      };

      next();
    } catch (error) {
      if (error instanceof Error) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }
      return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED));
    }
  };
}
