import { MentorAvailabilityEntity } from '../../../../domain/session/MentorAvailabilityEntity';
import { CreateMentorAvailabilityDTO } from '../../../dto/SessionDTO';

export interface ICreateMentorAvailabilityUseCase {
    execute(input:CreateMentorAvailabilityDTO):Promise<MentorAvailabilityEntity>;
}