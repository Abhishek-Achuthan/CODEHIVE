import { inject,injectable } from 'tsyringe';
import { IGoogleLoginUseCase } from '../interface/auth/IGoogleLoginUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IJWTService } from '../../ports/security/IJWTService';
import { UserEntity } from '../../../domain/entities/UserEntity';
import type { IGoogleAuthService } from '../../ports/security/IGoogleAuthService';
import { UserRole } from '../../../domain/types/UserRole';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('IGoogleAuthService') private readonly _googleAuthService: IGoogleAuthService,
        @inject('IJWTService') private readonly _jwtService : IJWTService
    ){}


    async execute(idToken: string): Promise<{
        user: UserEntity,
        accessToken:string;
        refreshToken:string;
    }> {
        
        const googleUser = await this._googleAuthService.verifyGoogleToken(idToken);

        if(!googleUser.email) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_GOOGLE_CREDENTIALS);

        let user = await this._userRepository.findByEmail(googleUser.email);

        if(!user) {
            user = await this._userRepository.create({
                firstName : googleUser.firstName,
                lastName:googleUser.lastName,
                email:googleUser.email,
                googleId:googleUser.googleId,
                role:UserRole.USER,
                isBlocked:false
            });
        }

        if(user.isBlocked) throw new BadRequestError(ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED);

        const accessToken = this._jwtService.genarateAccessToken({userRole:user.role,sub:user.id});
        const refreshToken = this._jwtService.genarateRefreshToken({userRole:user.role,sub:user.id});

        return {user, accessToken, refreshToken};
    }

}