import { MentorAvailabilityEntity } from '../../../../domain/session/MentorAvailabilityEntity';

export interface IAddAvailabilityExceptionUseCase {
    execute(availabilityId: string, mentorId: string, exdate: string): Promise<MentorAvailabilityEntity | null>
}
