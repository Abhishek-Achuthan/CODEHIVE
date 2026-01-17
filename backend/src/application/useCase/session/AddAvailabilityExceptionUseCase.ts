import { inject, injectable } from 'tsyringe';
import { IAddAvailabilityExceptionUseCase } from '../interface/session/IAddAvailabilityExceptionUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';

@injectable()
export class AddAvailabilityExceptionUseCase implements IAddAvailabilityExceptionUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository')
        private readonly _mentorAvailabilityRepository: IMentorAvailabilityRepository
    ) { }

    async execute(availabilityId: string, mentorId: string, exdate: string): Promise<MentorAvailabilityEntity | null> {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(exdate)) {
            throw new BadRequestError('Date must be in YYYY-MM-DD format');
        }

        const exceptionDate = new Date(exdate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (exceptionDate < today) {
            throw new BadRequestError('Exception date cannot be in the past');
        }

        const availability = await this._mentorAvailabilityRepository.find(availabilityId);

        if (!availability) {
            throw new NotFoundError('Availability rule not found');
        }

        if (availability.mentorId !== mentorId) {
            throw new ForbiddenError('You can only modify your own availability rules');
        }

        const storedExdate = exdate.replace(/-/g, '');

        return this._mentorAvailabilityRepository.addException(availabilityId, storedExdate);
    }
}
