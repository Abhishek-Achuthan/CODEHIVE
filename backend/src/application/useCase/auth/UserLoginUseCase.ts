import { inject, injectable } from 'tsyringe';
import { IUserLoginUseCase } from '../interface/auth/IUserLoginUseCase';
import type { IHashService } from '../../ports/security/IHashService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IUserLoginInputDTO, IUserLoginResponseDTO } from '../../dto/UserDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IJWTService } from '../../ports/security/IJWTService';
import { UserMapper } from '../../mapper/UserMapper';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @inject('IHashService') private readonly _hashService: IHashService,
    @inject('IJWTService') private readonly _jwtService: IJWTService
  ) {}

  async execute(data: IUserLoginInputDTO): Promise<IUserLoginResponseDTO> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

    if (user.isBlocked) throw new BadRequestError(ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED);

    if (user.password) {
      const validUser = await this._hashService.compare(
        data.password,
        user.password
      );

      if (!validUser) throw new BadRequestError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const accessToken = this._jwtService.genarateAccessToken({        
      userRole: user.role,
      sub: user.id,
    });

    const refreshToken = this._jwtService.genarateRefreshToken({
      userRole: user.role,
      sub: user.id,
    });

    return UserMapper.toLoginResponse(user, accessToken, refreshToken);
  }
}
