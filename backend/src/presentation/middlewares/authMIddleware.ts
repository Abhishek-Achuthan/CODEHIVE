import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { IJWTService } from '../../application/ports/security/IJWTService';
import type { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UnauthorizedError } from '../../core/errors/UnauthorizedError';
import { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { NotFoundError } from '../../core/errors/NotFoundError';
import { UserRole } from '../../domain/types/UserRole';

@injectable()
export class AuthMiddleware {
  constructor(
    @inject('IJWTService') private _jwtService: IJWTService,
    @inject('IUserRepository') private _userRepository: IUserRepository
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

      if (!decoded?.sub) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }

      const user = await this._userRepository.find(decoded.sub);

      if (!user || user.isBlocked) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED));
      }

      req.user = {
        id: user.id,
        role: user.role as UserRole,
        mentorStatus: user.mentorStatus,
      };

      next();
    } catch (error) {
      if (error instanceof Error) {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
      }
      return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED));
    };
  };
}
