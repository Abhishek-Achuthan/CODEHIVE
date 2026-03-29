import { MentorAvailabilityEntity } from '../../../../domain/session/MentorAvailabilityEntity';

export interface IDeleteMentorAvailabilityUseCase {
    execute(availabilityId: string, mentorId: string): Promise<MentorAvailabilityEntity | null>
}
