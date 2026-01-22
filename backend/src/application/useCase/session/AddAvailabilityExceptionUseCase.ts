import { inject, injectable } from 'tsyringe';
import { IAddAvailabilityExceptionUseCase } from '../interface/session/IAddAvailabilityExceptionUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class AddAvailabilityExceptionUseCase implements IAddAvailabilityExceptionUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository')
        private readonly _mentorAvailabilityRepository: IMentorAvailabilityRepository
    ) { }

    async execute(availabilityId: string, mentorId: string, exdate: string): Promise<MentorAvailabilityEntity | null> {
        const exceptionDate = new Date(exdate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (exceptionDate < today) {
            throw new BadRequestError(ERROR_MESSAGES.SESSION.EXCEPTION_DATE_IN_PAST);
        }

        const availability = await this._mentorAvailabilityRepository.find(availabilityId);

        if (!availability) {
            throw new NotFoundError(ERROR_MESSAGES.SESSION.AVAILABILITY_NOT_FOUND);
        }

        if (availability.mentorId !== mentorId) {
            throw new ForbiddenError(ERROR_MESSAGES.SESSION.AVAILABILITY_MODIFY_FORBIDDEN);
        }

        const storedExdate = exdate.replace(/-/g, '');

        return this._mentorAvailabilityRepository.addException(availabilityId, storedExdate);
    }
}
