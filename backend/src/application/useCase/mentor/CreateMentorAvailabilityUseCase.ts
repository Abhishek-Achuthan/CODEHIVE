import { inject, injectable } from 'tsyringe';
import { ICreateMentorAvailabilityUseCase } from '../interface/mentor/ICreateMentorAvailabilityUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { CreateMentorAvailabilityDTO } from '../../dto/SessionDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';

@injectable()
export class CreateMentorAvailabilityUseCase implements ICreateMentorAvailabilityUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _mentorAvailabilityRepository:IMentorAvailabilityRepository,
        @inject('IUserRepository') private readonly _userRepository: IUserRepository
    ){}

    async execute(input: CreateMentorAvailabilityDTO): Promise<MentorAvailabilityEntity> {
        const mentor = await this._userRepository.find(input.mentorId);

        if (!mentor) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
        if (mentor.role !== UserRole.MENTOR || mentor.mentorStatus !== MentorStatus.APPROVED) {
            throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);
        }

        return this._mentorAvailabilityRepository.create(
           { ...input,
            isActive:true}
        )
    }
}
