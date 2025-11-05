import { inject, injectable } from "tsyringe";
import type { IRefreshAccessTokenUseCase } from "../interface/auth/IRefreshAccessTokenUseCase";
import type { IJWTService } from "../../ports/security/IJWTService";
import type { ITokenBlacklistService } from "../../ports/security/ITokenBlacklistService";
import { ForbiddenError } from "../../../core/errors/ForbiddenError";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
  constructor(
    @inject("IJWTService") private readonly _jwtService: IJWTService,
    @inject("ITokenBlacklistService")
    private readonly _tokenBlacklistService: ITokenBlacklistService
  ) {}

  async execute(refreshToken: string): Promise<string> {
    if (!refreshToken) throw new ForbiddenError("Missing refresh token");

    const isBlacklisted = await this._tokenBlacklistService.isTokenBlacklisted(
      refreshToken
    );

    if (isBlacklisted) throw new ForbiddenError("Invalid refresh token");

      const data = this._jwtService.verifyRefreshToken(refreshToken) as JwtPayload;

      if (!data || !data.sub || !data.userRole) {
        throw new ForbiddenError("Invalid refresh token payload");
      }

      const newAccessToken = this._jwtService.genarateAccessToken({
        userRole: data.userRole,
        sub: data.sub,
      });

      return newAccessToken;
  }
}
