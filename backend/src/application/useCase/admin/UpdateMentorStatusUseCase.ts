import { inject, injectable } from 'tsyringe';
import { IUpdateMentorStatusUseCase } from '../interface/admin/IUpdateMentorStatusUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { UserRole } from '../../../domain/types/UserRole';

@injectable()
export class UpdateMentorStatusUseCase implements IUpdateMentorStatusUseCase {

    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository,
    ) { }

    async execute(id: string, status: 'approved' | 'rejected'): Promise<void> {
        const user = await this._userRepository.find(id);

        if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

        const mentorStatus = status === 'approved' ? MentorStatus.APPROVED : MentorStatus.REJECTED;
        const role = status === 'approved' ? UserRole.MENTOR : UserRole.USER;

        await this._userRepository.update(id, { mentorStatus, role });
    }
}
