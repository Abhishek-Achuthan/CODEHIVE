import { inject, injectable } from 'tsyringe';
import type { IRefreshAccessTokenUseCase } from '../interface/auth/IRefreshAccessTokenUseCase';
import type { IJWTService } from '../../ports/security/IJWTService';
import type { ITokenBlacklistService } from '../../ports/security/ITokenBlacklistService';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
  constructor(
    @inject('IJWTService') private readonly _jwtService: IJWTService,
    @inject('ITokenBlacklistService')
    private readonly _tokenBlacklistService: ITokenBlacklistService
  ) {}

  async execute(refreshToken: string): Promise<string> {
    if (!refreshToken) throw new ForbiddenError(ERROR_MESSAGES.AUTH.MISSING_REFRESH_TOKEN);

    const isBlacklisted = await this._tokenBlacklistService.isTokenBlacklisted(
      refreshToken
    );

    if (isBlacklisted) throw new ForbiddenError(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN);

      const data = this._jwtService.verifyRefreshToken(refreshToken) as JwtPayload;

      if (!data || !data.sub || !data.userRole) {
        throw new ForbiddenError(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN_PAYLOAD);
      }

      const newAccessToken = this._jwtService.genarateAccessToken({
        userRole: data.userRole,
        sub: data.sub,
      });

      return newAccessToken;
  }
}
