import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IJWTService } from "../../application/ports/security/IJWTService";
import { UnauthorizedError } from "../../core/errors/UnauthorizedError";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJWTService") private _jwtService: IJWTService,
  ) {}

  check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header("Authorization");

      if (!header?.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Invalid Token"));
      }

      const token = header.split(" ")[1];

      if (!token) {
        return next(new UnauthorizedError("Invalid Token"));
      }

      const decoded = this._jwtService.verifyAccessToken(token) as JwtPayload;

      if (!decoded) {
        return next(new UnauthorizedError("Invalid Token"));
      }

      (req as any).user = {
        id: decoded.sub,
        role: decoded.userRole,
      };

      next();
    } catch (error) {
      if (error instanceof Error) {
        return next(new UnauthorizedError("Invalid or expired token"));
      }
      return next(new UnauthorizedError("Authentication failed"));
    }
  };
}
