import { inject,injectable } from "tsyringe";
import { IUserLogoutUseCase } from "../interface/auth/IUserLogoutUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import type { ITokenBlacklistService } from "../../ports/security/ITokenBlacklistService";

@injectable()
export class UserLogoutUseCase implements IUserLogoutUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('ITokenBlacklistService') private readonly _tokenBlacklistService: ITokenBlacklistService
    ) {};

    async execute(token: string, email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);

        if(!user) throw new NotFoundError('User not Found');

        await this._tokenBlacklistService.blacklistToken(token);
    }
}