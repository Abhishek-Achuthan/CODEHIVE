import { JwtPayload } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import {
  AuthenticateRealtimeUserDTO,
  RealtimeUserContextDTO,
} from '../../dto/CollaborationDTO';
import type { IJWTService } from '../../ports/security/IJWTService';
import { IAuthenticateRealtimeUserUseCase } from '../interface/realtime/IAuthenticateRealtimeUserUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class AuthenticateRealtimeUserUseCase
  implements IAuthenticateRealtimeUserUseCase
{
  constructor(
    @inject('IJWTService') private readonly _jwtService: IJWTService,
    @inject('IUserRepository') private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    data: AuthenticateRealtimeUserDTO
  ): Promise<RealtimeUserContextDTO> {
    const decoded = this._jwtService.verifyAccessToken(data.token) as JwtPayload;

    if (!decoded?.sub) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
    }

    const user = await this._userRepository.find(decoded.sub);

    if (!user || user.isBlocked) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    return {
      userId: user.id,
      role: user.role,
      mentorStatus: user.mentorStatus,
    };
  }
}
