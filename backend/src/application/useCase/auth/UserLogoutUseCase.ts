import { inject,injectable } from "tsyringe";
import { IUserLogoutUseCase } from "../interface/auth/IUserLogoutUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import type { ITokenBlacklistService } from "../../ports/security/ITokenBlacklistService";

@injectable()
export class UserLogoutUseCase implements IUserLogoutUseCase {
    constructor(
        @inject('ITokenBlacklistService') private readonly _tokenBlacklistService: ITokenBlacklistService
    ) {};

    async execute(token: string): Promise<void> {

        await this._tokenBlacklistService.blacklistToken(token);
        
    }
}