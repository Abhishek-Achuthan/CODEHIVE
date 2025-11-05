import { inject,injectable } from "tsyringe";
import type { IGithubLoginUseCase } from "../interface/auth/IGithubLoginUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import type { IJWTService } from "../../ports/security/IJWTService";
import { UserEntity } from "../../../domain/entities/UserEntity";
import type { IGithubAuthService } from "../../ports/security/IGithubAuthService";
import { BadRequestError } from "../../../core/errors/BadRequestError";
import { UserRole } from "../../../domain/types/UserRole";


@injectable()
export class GithubLoginUseCase implements IGithubLoginUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('IGithubAuthService' ) private readonly _githubAuthService : IGithubAuthService,
        @inject('IJWTService') private readonly _jwtService : IJWTService
    ) {}


    async execute(code: string): Promise<{ user: UserEntity; accessToken: string; refreshToken: string; }> {
        
        const githubUser = await this._githubAuthService.getUserFromCode(code);

        if(!githubUser.email) throw new BadRequestError("Invalid Github credentials");

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
            if (!user) throw new BadRequestError("Failed to update user account");
        }


        if(user.isBlocked) throw new BadRequestError("Your accound is blocked");


        const accessToken = this._jwtService.genarateAccessToken({userRole:user.role,sub:user.id});
        const refreshToken = this._jwtService.genarateRefreshToken({userRole:user.role,sub:user.id});


        return {user,accessToken,refreshToken}

   }


}