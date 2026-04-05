import { MentorAvailabilityEntity } from '../session/MentorAvailabilityEntity';
import { IGenericRepository } from './IGenericRepository';

export interface IMentorAvailabilityRepository extends IGenericRepository<MentorAvailabilityEntity> {
    findByMentor(mentorId: string): Promise<MentorAvailabilityEntity[]>
    findMentorIdsByFilters(filters: {
        slotPriceMin?: number;
        slotPriceMax?: number;
        hasActiveAvailability?: boolean;
    }): Promise<string[]>
    deactivate(id: string): Promise<MentorAvailabilityEntity | null>
    addException(id: string, exdate: string): Promise<MentorAvailabilityEntity | null>
}
