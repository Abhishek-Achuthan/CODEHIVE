import { inject, injectable } from 'tsyringe';
import { ISetPasswordUseCase } from '../interface/auth/ISetPasswordUseCase';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { type IHashService } from '../../ports/security/IHashService';
import { BadRequestError } from '../../../core/errors/BadRequestError';

@injectable()
export class SetPasswordUseCase implements ISetPasswordUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository,
        @inject('IHashService') private readonly _hashService: IHashService,
    ) {}

    async execute(newPass: string, userId: string): Promise<void> {
        const user = await this._userRepository.find(userId);

        if (!user) throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);

        if (user.password) {
            throw new BadRequestError(ERROR_MESSAGES.AUTH.PASSWORD_ALREADY_SET);
        }

        const hashedPass = await this._hashService.hash(newPass);

        await this._userRepository.update(
            user.id,
            { password: hashedPass }
        );
    }
}
