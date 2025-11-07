import { inject,injectable } from 'tsyringe';
import { IResetPasswordUseCase } from '../interface/auth/IResetPasswordUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IHashService } from '../../ports/security/IHashService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('IHashService') private readonly _hashService : IHashService,
    ){}

    async execute(email: string, password: string): Promise<void> {
        
        const user = await this._userRepository.findByEmail(email);

        if(!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

        const hashedPassword = await this._hashService.hash(password);

        await this._userRepository.update(user.id,{password:hashedPassword });
    }

}