import { inject, injectable } from 'tsyringe';
import { IDeleteMentorAvailabilityUseCase } from '../interface/session/IDeleteMentorAvailabilityUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';

@injectable()
export class DeleteMentorAvailabilityUseCase implements IDeleteMentorAvailabilityUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository')
        private readonly _mentorAvailabilityRepository: IMentorAvailabilityRepository
    ) { }

    async execute(availabilityId: string, mentorId: string): Promise<MentorAvailabilityEntity | null> {
        const availability = await this._mentorAvailabilityRepository.find(availabilityId);

        if (!availability) {
            throw new NotFoundError('Availability rule not found');
        }

        if (availability.mentorId !== mentorId) {
            throw new ForbiddenError('You can only delete your own availability rules');
        }

        return this._mentorAvailabilityRepository.deactivate(availabilityId);
    }
}
