import { MentorAvailabilityEntity } from '../../../../domain/session/MentorAvailabilityEntity';

export interface IGetMentorAvailabilityUseCase {
    execute(mentorId:string):Promise<MentorAvailabilityEntity[]>
}