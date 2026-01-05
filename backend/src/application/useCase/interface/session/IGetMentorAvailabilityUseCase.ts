import { MentorAvailablityEntity } from '../../../../domain/session/MentorAvailablityEntity';

export interface IGetMentorAvailabilityUseCase {
    execute(mentorId:string):Promise<MentorAvailablityEntity[]>
}