import { inject,injectable } from 'tsyringe';
import type { IGithubLoginUseCase } from '../interface/auth/IGithubLoginUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IJWTService } from '../../ports/security/IJWTService';
import type { IGithubAuthService } from '../../ports/security/IGithubAuthService';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { UserRole } from '../../../domain/types/UserRole';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { IUserLoginResponseDTO } from '../../dto/UserDTO';
import { UserMapper } from '../../mapper/UserMapper';


@injectable()
export class GithubLoginUseCase implements IGithubLoginUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('IGithubAuthService' ) private readonly _githubAuthService : IGithubAuthService,
        @inject('IJWTService') private readonly _jwtService : IJWTService
    ) {}


    async execute(code: string): Promise<IUserLoginResponseDTO> {
        
        const githubUser = await this._githubAuthService.getUserFromCode(code);

        if(!githubUser.email) throw new BadRequestError(ERROR_MESSAGES.GITHUB.INVALID_CREDENTIALS);

        let user = await this._userRepository.findByEmail(githubUser.email)

        if(!user) {
            user = await this._userRepository.create({
                firstName:githubUser.name,
                lastName:'',
                email:githubUser.email,
                githubId:githubUser.githubId,
                role:UserRole.USER,
                isBlocked:false,
            });
        } else if (!user.githubId) {
            await this._userRepository.update(user.id, {
                githubId: githubUser.githubId
            });
            user = await this._userRepository.findByEmail(githubUser.email);
            if (!user) throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_FAILED);
        }


        if(user.isBlocked) throw new BadRequestError(ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED);


        const accessToken = this._jwtService.genarateAccessToken({userRole:user.role,sub:user.id});
        const refreshToken = this._jwtService.genarateRefreshToken({userRole:user.role,sub:user.id});


        return UserMapper.toLoginResponse(user,accessToken,refreshToken)

   }


}
