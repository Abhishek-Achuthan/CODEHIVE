import { inject, injectable } from 'tsyringe';
import { IApplyForMentorUseCase } from '../interface/user/IApplyForMentorUseCase';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { UserEntity } from '../../../domain/entities/UserEntity';
import { InternalServerError } from '../../../core/errors/InternalServerError';


@injectable()
export class ApplyForMentorUseCase implements IApplyForMentorUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<UserEntity> {
        const user = await this._userRepository.find(userId);

        if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

        if (user.role === UserRole.MENTOR) throw new BadRequestError(ERROR_MESSAGES.USER.ALREADY_MENTOR);

        if (user.mentorStatus === MentorStatus.PENDING) throw new BadRequestError(ERROR_MESSAGES.USER.ALREADY_APPLIED);

        const updatedUser = await this._userRepository.update(userId, { mentorAppliedAt: new Date(), mentorStatus: MentorStatus.PENDING });

        if (!updatedUser) throw new InternalServerError(ERROR_MESSAGES.USER.APPLY_FOR_MENTOR_FAILED);

        return updatedUser;
    };
};