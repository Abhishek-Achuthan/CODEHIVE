import { injectable } from 'tsyringe';
import { UnauthorizedError } from '../../core/errors/UnauthorizedError';
import { ForbiddenError } from '../../core/errors/ForbiddenError';
import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';



@injectable()
export class RoleMiddleware {
    authorize = (roles:string[]) => {
        return (req:Request,res:Response,next:NextFunction) => {
            const user = req.user;

            if(!user) {
                return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.AUTHENTICATION_REQUIRED));
            }

            if(!roles.includes(user.role)) {
                return next(new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN));
            }

            next();
        }
    }
}